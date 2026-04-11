const db = require('../config/db');

const Community = {
    createPost: async (postData) => {
        const { user_id, author_name, author_avatar, place_name, location, category, budget, best_time, caption, tips, rating } = postData;
        const [result] = await db.query(
            `INSERT INTO community_posts (user_id, author_name, author_avatar, place_name, location, category, budget, best_time, caption, tips, rating) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, author_name, author_avatar, place_name, location, category, budget || null, best_time || null, caption, tips || null, rating || 0]
        );
        return result.insertId;
    },

    addImages: async (postId, images) => {
        if (!images || images.length === 0) return;
        const values = images.map(url => [postId, url]);
        await db.query(`INSERT INTO post_images (post_id, image_url) VALUES ?`, [values]);
    },

    getPosts: async (filters, userId) => {
        let query = `
            SELECT p.*, 
                   IFNULL(JSON_ARRAYAGG(pi.image_url), JSON_ARRAY()) as images,
                   IFNULL(lc.loc_count, 0) as loc_count
                   ${userId ? ', (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.id AND pl2.user_id = ?) as has_liked' : ', 0 as has_liked'}
            FROM community_posts p
            LEFT JOIN post_images pi ON p.id = pi.post_id
            LEFT JOIN (
                SELECT location, COUNT(id) as loc_count
                FROM community_posts
                GROUP BY location
            ) lc ON lc.location = p.location
        `;
        const params = [];
        if (userId) params.push(userId);
        const conditions = [];

        if (filters.category && filters.category !== 'All') {
            // Frontend pills might be plural (e.g. Beaches, Mountains)
            // Normalizing to singular to match DB records via regex or simple mapping:
            let catMatch = filters.category;
            if (catMatch === 'Beaches') catMatch = 'Beach';
            if (catMatch === 'Mountains') catMatch = 'Mountain';
            if (catMatch === 'Temples') catMatch = 'Temple';
            if (catMatch === 'Cities') catMatch = 'City';

            conditions.push(`p.category = ?`);
            params.push(catMatch);
        }

        if (filters.search) {
            conditions.push(`(p.place_name LIKE ? OR p.location LIKE ?)`);
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters.budget) {
            if (filters.budget === 'under2k') {
                conditions.push(`p.budget < 2000`);
            } else if (filters.budget === '2k-5k') {
                conditions.push(`p.budget BETWEEN 2000 AND 5000`);
            } else if (filters.budget === '5k-10k') {
                conditions.push(`p.budget BETWEEN 5000 AND 10000`);
            } else if (filters.budget === '10k-20k') {
                conditions.push(`p.budget BETWEEN 10000 AND 20000`);
            } else if (filters.budget === 'above20k') {
                conditions.push(`p.budget > 20000`);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
        }

        query += ` GROUP BY p.id `;

        if (filters.sort === 'popular') {
            query += ` ORDER BY loc_count DESC, p.created_at DESC `;
        } else if (filters.sort === 'toprated') {
            query += ` ORDER BY p.likes DESC, p.created_at DESC `;
        } else {
            query += ` ORDER BY p.created_at DESC `; // latest
        }

        const [rows] = await db.query(query, params);

        // Cleanup JSON serialization quirks from grouped output
        return rows.map(r => {
            if (r.images && typeof r.images === 'string') {
                try { r.images = JSON.parse(r.images); } catch (e) { }
            }
            if (r.images[0] === null) r.images = []; // MySQL JSON_ARRAYAGG weirdness handling
            // Deduplicate images (GROUP BY can cause duplicates)
            r.images = [...new Set(r.images)].filter(Boolean);
            r.has_liked = r.has_liked > 0;
            return r;
        });
    },

    getTrendingPlaces: async () => {
        const query = `
            SELECT place_name, location, COUNT(id) as post_count,
                   (SELECT image_url FROM post_images pi WHERE pi.post_id = p.id LIMIT 1) as cover_image
            FROM community_posts p
            GROUP BY place_name, location
            ORDER BY post_count DESC
            LIMIT 4
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    getTopTravelers: async () => {
        const query = `
            SELECT user_id, author_name as full_name, author_avatar as avatar, COUNT(id) as post_count
            FROM community_posts
            GROUP BY user_id, author_name, author_avatar
            ORDER BY post_count DESC
            LIMIT 3
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    toggleLike: async (postId, userId) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const [[exists]] = await connection.query(`SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?`, [postId, userId]);
            if (exists) {
                await connection.query(`DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`, [postId, userId]);
                await connection.query(`UPDATE community_posts SET likes = GREATEST(likes - 1, 0) WHERE id = ?`, [postId]);
            } else {
                await connection.query(`INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)`, [postId, userId]);
                await connection.query(`UPDATE community_posts SET likes = likes + 1 WHERE id = ?`, [postId]);
            }
            await connection.commit();

            const [[post]] = await connection.query(`SELECT likes FROM community_posts WHERE id = ?`, [postId]);
            return { likes: post.likes, hasLiked: !exists };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },

    addComment: async (postId, userId, text) => {
        const query = `INSERT INTO post_comments (post_id, user_id, comment_text) VALUES (?, ?, ?)`;
        const [result] = await db.query(query, [postId, userId, text]);
        return result.insertId;
    },

    getComments: async (postId) => {
        const query = `
            SELECT c.id, c.comment_text, c.created_at, u.full_name, u.role
            FROM post_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `;
        const [rows] = await db.query(query, [postId]);
        return rows;
    },

    getDistinctCategories: async () => {
        const query = `
            SELECT DISTINCT category 
            FROM community_posts 
            WHERE category IS NOT NULL 
              AND category != '' 
              AND category != 'All'
            ORDER BY category ASC
        `;
        const [rows] = await db.query(query);
        return rows.map(r => r.category);
    },

    updatePost: async (postId, userId, caption, tips) => {
        const query = `UPDATE community_posts SET caption = ?, tips = ? WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(query, [caption, tips || null, postId, userId]);
        return result.affectedRows > 0;
    },

    deletePost: async (postId, userId) => {
        const query = `DELETE FROM community_posts WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(query, [postId, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = Community;
