import express from 'express';
import multer from 'multer';
import { summarizeFeature } from '../controllers/featureController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './tmp'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

router.post('/summarize', upload.single('file'), summarizeFeature);



import { explainFeature } from '../controllers/featureController.js';

router.post('/explain', upload.single('file'), explainFeature);



import { termsFeature } from '../controllers/featureController.js';

router.post('/terms', upload.single('file'), termsFeature);



import { acronymFeature } from '../controllers/featureController.js';

router.post('/acronyms', upload.single('file'), acronymFeature);



export default router;
