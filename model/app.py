from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from pathlib import Path
import os
from disease_info import DISEASE_INFO
from typing import Optional, List
import sys
import json
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Plant Disease Detection API",
    description="API for detecting plant diseases and providing treatment recommendations",
    version="2.0.0"
)

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Updated class names to exactly match disease_model.ipynb
CLASS_NAMES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# Load model with error handling
try:
    model_path = Path(__file__).parent.absolute() / "saved_models" / "plant_disease_prediction_model.h5"
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    MODEL = tf.keras.models.load_model(model_path)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    MODEL = None

@app.get('/ping')
async def ping():
    """Check if the server is running"""
    return {"status": "ok", "message": "Server is running!"}

@app.get('/plants')
async def get_plants():
    """Get list of supported plants"""
    plants = set()
    for class_name in CLASS_NAMES:
        plant = class_name.split('___')[0]
        plants.add(plant)
    return list(plants)

@app.get('/diseases/{plant_name}')
async def get_diseases(plant_name: str):
    """Get list of diseases for a specific plant"""
    diseases = []
    for class_name in CLASS_NAMES:
        if class_name.startswith(plant_name + '___'):
            disease = class_name.split('___')[1]
            if disease != 'healthy':
                diseases.append(disease)
    return diseases

@app.get('/disease-info/{disease_name}')
async def get_disease_info(disease_name: str):
    """Get information about a specific disease"""
    if disease_name not in DISEASE_INFO:
        raise HTTPException(status_code=404, detail="Disease not found")
    
    return DISEASE_INFO[disease_name]

@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    """Predict plant disease from image"""
    try:
        logger.info("Received prediction request")
        
        if MODEL is None:
            logger.error("Model is None - not loaded properly")
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Validate file
        if not file.content_type.startswith('image/'):
            logger.error(f"Invalid file type: {file.content_type}")
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and preprocess image
        contents = await file.read()
        logger.info(f"Read image file of size: {len(contents)} bytes")
        
        image = Image.open(BytesIO(contents))
        logger.info(f"Image opened successfully. Size: {image.size}, Mode: {image.mode}")
        
        # Resize image
        image = image.resize((224, 224))
        logger.info("Image resized to 224x224")
        
        # Convert to numpy array
        image_array = np.array(image)
        logger.info(f"Image converted to numpy array. Shape: {image_array.shape}, Dtype: {image_array.dtype}")
        
        # Normalize
        image_array = image_array / 255.0
        logger.info("Image normalized")
        
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        logger.info(f"Added batch dimension. New shape: {image_array.shape}")
        
        # Make prediction
        logger.info("Making prediction...")
        predictions = MODEL.predict(image_array)
        logger.info(f"Prediction completed. Raw predictions shape: {predictions.shape}")
        
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))
        logger.info(f"Predicted class: {predicted_class}, Confidence: {confidence}")
        
        # Parse result
        plant_name, disease = predicted_class.split('___')
        is_healthy = disease == 'healthy'
        
        # Get disease info if not healthy
        disease_details = None
        if not is_healthy:
            # Use the full class name (with ___) to look up disease info
            if predicted_class in DISEASE_INFO:
                disease_details = DISEASE_INFO[predicted_class]
                logger.info(f"Found disease details for {predicted_class}")
            else:
                logger.warning(f"No disease info found for {predicted_class}")
        
        result = {
            "plant_name": plant_name,
            "is_healthy": is_healthy,
            "disease": disease,
            "confidence": confidence,
            "disease_details": disease_details
        }
        logger.info(f"Returning result: {result}")
        
        return result
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
