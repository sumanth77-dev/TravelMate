const Community = require('../models/communityModel');

// Basic internal AI Keyword Classifier
const inferCategory = (text) => {
    if (!text) return null;
    const t = text.toLowerCase();
    if (/beach|sand|ocean|sea|coast|island|surf|shore/i.test(t)) return 'Beach';
    if (/mountain|hike|peak|hill|altitude|trek|valley|snow/i.test(t)) return 'Mountain';
    if (/temple|shrine|mosque|church|god|monk|prayer|heritage|sacred/i.test(t)) return 'Temple';
    if (/city|urban|street|downtown|metro|tower|mall|nightlife|capital/i.test(t)) return 'City';
    if (/adventure|safari|camp|wild|jump|dive|raft|extreme|zipline/i.test(t)) return 'Adventure';
    if (/food|eat|meal|restaurant|cafe|dish|cuisine|taste|spicy|sweet|snack/i.test(t)) return 'Food';
    return null;
};

const createPost = async (req, res) => {
    try {
        const { place_name, location, budget, best_time, caption, tips, rating } = req.body;
        // The user manually dropped a category via form, but we pass it through our inference engine.
        let providedCategory = req.body.category || 'Other';

        // --- AI OVERRIDE ---
        const combinedContext = `${caption || ''} ${tips || ''} ${place_name || ''}`;
        const autoDetected = inferCategory(combinedContext);
        
        // Only run inference if they selected the generic 'Other' and did not specify a custom text
        const finalCategory = (providedCategory === 'Other') 
            ? (autoDetected || 'Other') 
            : providedCategory;

        // Ensure user is verified from token
        const userId = req.user.id;
        const authorName = req.user.full_name || req.body.author_name || 'Traveler';
        const authorAvatar = req.user.avatar || null; // Extendable

        const payload = {
            user_id: userId,
            author_name: authorName,
            author_avatar: authorAvatar,
            place_name, location,
            category: finalCategory,
            budget, best_time, caption, tips, rating
        };

        const postId = await Community.createPost(payload);

        // Process Multer Image Array
        let photoPoints = 0;
        if (req.files && req.files.length > 0) {
            const uploadedUrls = req.files.map(f => f.path.replace(/\\/g, '/'));
            await Community.addImages(postId, uploadedUrls);
            photoPoints = req.files.length * 10;
        }

        try {
            const db = require('../config/db');
            await db.query('UPDATE users SET points = points + ? WHERE id = ?', [50 + photoPoints, userId]);
        } catch(e) { console.error('Failed to attach generic post points', e); }

        // --- NOTIFICATION HOOK: New Post created ---
        try {
            const Notification = require('../models/notificationModel');
            const db = require('../config/db');
            const [users] = await db.query('SELECT id FROM users WHERE id != ?', [userId]);
            if (users.length > 0) {
                await Notification.createBulk(users.map(u => u.id), 'new_post', 'New post added in community');
                console.log(`[DEBUG] NOTIFICATION INSERTED - Type: new_post, Message: New post added in community`);
                console.log(`[DEBUG] Receiving user_ids: ${users.map(u => u.id).join(', ')}`);
            }
        } catch (notifErr) { console.error('[DEBUG] Fault propagating post creation notifications:', notifErr); }

        res.status(201).json({ message: 'Post analyzed and created successfully', postId, assignedCategory: finalCategory });

    } catch (err) {
        console.error('Error creating community post:', err);
        res.status(500).json({ message: 'Server error processing post implementation.' });
    }
};

const getPosts = async (req, res) => {
    try {
        const filters = {
            category: req.query.category,
            sort: req.query.sort, // 'latest', 'popular', 'toprated'
            search: req.query.search,
            budget: req.query.budget
        };

        const posts = await Community.getPosts(filters);

        // To make it easy for frontend to just parse, we handle null JSON returns
        const formatted = posts.map(p => ({
            ...p,
            images: Array.isArray(p.images) && p.images[0] !== null ? p.images : []
        }));

        res.status(200).json(formatted);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Failure pulling community feed.' });
    }
};

const getTrending = async (req, res) => {
    try {
        const trending = await Community.getTrendingPlaces();
        res.status(200).json(trending);
    } catch (err) {
        console.error('Error calculating trending placements:', err);
        res.status(500).json({ message: 'Server error aggregating trend logic.' });
    }
};

const getTopTravelers = async (req, res) => {
    try {
        const travelers = await Community.getTopTravelers();
        res.status(200).json(travelers);
    } catch (err) {
        console.error('Error calculating top travelers:', err);
        res.status(500).json({ message: 'Server error aggregating top travelers.' });
    }
};

const toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const result = await Community.toggleLike(postId, userId);
        
        // --- NOTIFICATION HOOK: Like Reaction ---
        if (result.action === 'liked') {
            try {
                const Notification = require('../models/notificationModel');
                const db = require('../config/db');
                const [[post]] = await db.query('SELECT user_id FROM community_posts WHERE id = ?', [postId]);
                if (post && post.user_id !== userId) {
                    await Notification.create(post.user_id, 'post_reaction', 'Someone reacted to your post');
                    console.log(`[DEBUG] NOTIFICATION INSERTED - Type: post_reaction, Message: Someone reacted to your post`);
                    console.log(`[DEBUG] Receiving user_id: ${post.user_id}`);
                }
            } catch (notifErr) { console.error('[DEBUG] Reaction (like) notification blocked: ', notifErr); }
        }

        res.status(200).json(result);
    } catch (err) {
        console.error('Liking Error:', err);
        res.status(500).json({ message: 'Failed to process like.' });
    }
};

const getComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Community.getComments(postId);
        res.status(200).json(comments);
    } catch (err) {
        console.error('Fetching comments error:', err);
        res.status(500).json({ message: 'Failed to fetch comments.' });
    }
};

const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text cannot be empty' });
        }

        const commentId = await Community.addComment(postId, userId, text);
        
        // --- NOTIFICATION HOOK: Comment Reaction ---
        try {
            const Notification = require('../models/notificationModel');
            const db = require('../config/db');
            const [[post]] = await db.query('SELECT user_id FROM community_posts WHERE id = ?', [postId]);
            if (post && post.user_id !== userId) {
                await Notification.create(post.user_id, 'post_reaction', 'Someone reacted to your post');
                console.log(`[DEBUG] NOTIFICATION INSERTED - Type: post_reaction, Message: Someone reacted to your post`);
                console.log(`[DEBUG] Receiving user_id: ${post.user_id}`);
            }
        } catch (notifErr) { console.error('[DEBUG] Reaction (comment) notification blocked: ', notifErr); }
        
        res.status(201).json({ message: 'Comment added successfully', commentId });
    } catch (err) {
        console.error('Adding comment error:', err);
        res.status(500).json({ message: 'Failed to add comment.' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Community.getDistinctCategories();
        res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Failed to aggregate categories.' });
    }
};

const editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { caption, tips } = req.body;

        if (!caption) {
            return res.status(400).json({ message: 'Caption cannot be empty' });
        }

        const success = await Community.updatePost(postId, userId, caption, tips);
        if (success) {
            res.status(200).json({ message: 'Post updated successfully' });
        } else {
            res.status(403).json({ message: 'Not authorized or post not found' });
        }
    } catch (err) {
        console.error('Editing post error:', err);
        res.status(500).json({ message: 'Failed to update post.' });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const success = await Community.deletePost(postId, userId);
        if (success) {
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(403).json({ message: 'Not authorized or post not found' });
        }
    } catch (err) {
        console.error('Deleting post error:', err);
        res.status(500).json({ message: 'Failed to delete post.' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getTrending,
    getTopTravelers,
    toggleLike,
    getComments,
    addComment,
    getCategories,
    editPost,
    deletePost
};
