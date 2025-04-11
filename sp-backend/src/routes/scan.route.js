import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { saveScan, getRecentScans, getScanDetails } from '../controllers/scan.controller.js';

const router = express.Router();

// Save a new scan
router.post('/save', protectRoute, saveScan);

// Get user's recent scans
router.get('/recent', protectRoute, getRecentScans);

// Get scan details by ID
router.get('/:id', protectRoute, getScanDetails);

export default router; 