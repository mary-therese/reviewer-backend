import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload.js';
import featureRoutes from './routes/feature.js';
import fs from 'fs';

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

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
