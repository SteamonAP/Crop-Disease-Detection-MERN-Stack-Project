import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load crop tips data from JSON file
const cropTipsPath = path.join(__dirname, '../models/crop_tips.json');
let cropTips;

try {
  cropTips = JSON.parse(fs.readFileSync(cropTipsPath, 'utf8'));
} catch (error) {
  console.error('Error loading crop tips data:', error);
  process.exit(1);
}

// Validate crop data structure
const validateCropData = (data) => {
  if (!data || typeof data !== 'object') return false;
  return Object.values(data).every(crop => 
    crop.icon && 
    crop.description && 
    typeof crop.icon === 'string' && 
    typeof crop.description === 'string'
  );
};

// Get all available crops
router.get('/crops', (req, res) => {
  try {
    if (!validateCropData(cropTips)) {
      throw new Error('Invalid crop data structure');
    }
    
    const crops = Object.entries(cropTips).map(([name, data]) => ({
      name,
      icon: data.icon,
      description: data.description
    }));

    res.json({ 
      success: true, 
      data: crops,
      count: crops.length,
      message: `Found ${crops.length} available crops`
    });
  } catch (error) {
    console.error('Error fetching available crops:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch available crops'
    });
  }
});

// Get tips for a specific crop
router.get('/crops/:cropName', (req, res) => {
  try {
    const { cropName } = req.params;
    
    if (!cropName || typeof cropName !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid crop name provided',
        message: 'Please provide a valid crop name'
      });
    }
    
    const cropData = cropTips[cropName];
    
    if (!cropData) {
      return res.status(404).json({ 
        success: false, 
        error: `No information found for ${cropName}`,
        message: 'The requested crop is not available in our database',
        suggestions: Object.keys(cropTips)
      });
    }
    
    res.json({ 
      success: true, 
      data: cropData,
      message: `Successfully retrieved information for ${cropName}`
    });
  } catch (error) {
    console.error('Error fetching crop details:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch crop details'
    });
  }
});

export default router; 