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
        const finalCategory = autoDetected || providedCategory;

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
        if (req.files && req.files.length > 0) {
            const uploadedUrls = req.files.map(f => f.path.replace(/\\/g, '/'));
            await Community.addImages(postId, uploadedUrls);
        }

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
        res.status(201).json({ message: 'Comment added successfully', commentId });
    } catch (err) {
        console.error('Adding comment error:', err);
        res.status(500).json({ message: 'Failed to add comment.' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getTrending,
    getTopTravelers,
    toggleLike,
    getComments,
    addComment
};
