const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profile_photo') {
            cb(null, 'uploads/profile_photos/');
        } else if (file.fieldname === 'government_id_upload') {
            cb(null, 'uploads/government_ids/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter (Allowed extensions)
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: File type not allowed! Allowed types: .jpg, .jpeg, .png, .pdf'));
    }
};

// Multer Config settings 
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

module.exports = upload;
