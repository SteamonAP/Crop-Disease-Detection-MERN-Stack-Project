import fetch from 'node-fetch';
import FormData from 'form-data';

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:10000';

export const predict = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'No image file provided',
                message: 'Please upload an image file'
            });
        }

        // Create form data
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Add language parameter if provided
        const lang = req.query.lang || 'en';
        
        // Make request to FastAPI server
        const response = await fetch(`${ML_SERVER_URL}/predict?lang=${lang}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Prediction failed');
        }

        const result = await response.json();
        
        // Format the response
        const formattedResult = {
            success: true,
            plant_name: result.plant_name,
            is_healthy: result.is_healthy,
            disease: result.disease,
            confidence: result.confidence,
            disease_details: {
                symptoms: result.disease_details?.symptoms || [],
                treatment: result.disease_details?.treatment || [],
                causes: result.disease_details?.causes || [],
                prevention: result.disease_details?.prevention || []
            }
        };

        res.json(formattedResult);

    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Prediction failed',
            message: error.message,
            details: error.stack
        });
    }
};

// Add other routes to access FastAPI endpoints
export const getPlants = async (req, res) => {
    try {
        const response = await fetch(`${ML_SERVER_URL}/plants`);
        if (!response.ok) {
            throw new Error('Failed to fetch plants');
        }
        const result = await response.json();
        res.json({
            success: true,
            plants: result
        });
    } catch (error) {
        console.error('Error fetching plants:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch plants',
            message: error.message
        });
    }
};

export const getDiseases = async (req, res) => {
    try {
        const { plantName } = req.params;
        const response = await fetch(`${ML_SERVER_URL}/diseases/${plantName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch diseases');
        }
        const result = await response.json();
        res.json({
            success: true,
            diseases: result
        });
    } catch (error) {
        console.error('Error fetching diseases:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch diseases',
            message: error.message
        });
    }
};

export const getDiseaseInfo = async (req, res) => {
    try {
        const { diseaseName } = req.params;
        // Convert disease name to the format expected by ML server
        const formattedDiseaseName = diseaseName.replace(/\s+/g, '_');
        const lang = req.query.lang || 'en';
        
        const response = await fetch(`${ML_SERVER_URL}/disease-info/${formattedDiseaseName}?lang=${lang}`);
        if (!response.ok) {
            throw new Error('Failed to fetch disease information');
        }
        
        const result = await response.json();
        
        // Format the response to match frontend expectations
        const formattedResult = {
            success: true,
            disease_info: {
                symptoms: result.symptoms || [],
                treatment: result.treatment || [],
                causes: result.causes || [],
                prevention: result.prevention || []
            }
        };
        
        res.json(formattedResult);
    } catch (error) {
        console.error('Error fetching disease info:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch disease information',
            message: error.message
        });
    }
}; 