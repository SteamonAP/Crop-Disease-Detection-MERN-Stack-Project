import express from "express";
import { predict, getPlants, getDiseases, getDiseaseInfo } from "../controllers/prediction.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Prediction routes
router.post("/predict", protectRoute, upload.single('image'), predict);
router.get("/plants", protectRoute, getPlants);
router.get("/diseases/:plant", protectRoute, getDiseases);
router.get("/disease-info/:disease", protectRoute, getDiseaseInfo);

export default router; 