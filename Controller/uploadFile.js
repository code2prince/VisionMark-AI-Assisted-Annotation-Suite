import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const handleFileUpload = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        next();
    });
};

export { handleFileUpload };
