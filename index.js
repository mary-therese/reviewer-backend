

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/upload.js';
import featureRoutes from './routes/feature.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Ensure tmp folder exists
if (!fs.existsSync('./tmp')) {
  fs.mkdirSync('./tmp');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/upload', uploadRoutes);
app.use('/feature', featureRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});


// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
