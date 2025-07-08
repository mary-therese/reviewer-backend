import express from 'express';
import multer from 'multer';

// All imports must go first
import {
  summarizeFeature,
  explainFeature,
  termsFeature,
  acronymFeature
} from '../controllers/featureController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './tmp'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Routes
router.post('/summarize', upload.single('file'), summarizeFeature);
router.post('/explain', upload.single('file'), explainFeature);
router.post('/terms', upload.single('file'), termsFeature);
router.post('/acronyms', upload.single('file'), acronymFeature);

export default router;
