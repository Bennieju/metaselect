from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import cv2
from PIL import Image
import io
import tensorflow as tf
from tensorflow import keras
import os
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MetaSelect API",
    description="Breast Cancer Classification API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store the loaded model
model = None

def load_model():
    """Load the trained model"""
    global model
    try:
        model_path = "../best_model.h5"
        if os.path.exists(model_path):
            model = keras.models.load_model(model_path)
            logger.info("Model loaded successfully")
        else:
            logger.error(f"Model file not found at {model_path}")
            raise FileNotFoundError(f"Model file not found at {model_path}")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

def preprocess_image(image_bytes: bytes, target_size: tuple = (224, 224)) -> np.ndarray:
    """Preprocess the uploaded image for model prediction"""
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        image_array = np.array(image)
        image_array = image_array.astype('float32') / 255.0
        
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "MetaSelect API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "message": "API is ready for predictions"
    }

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    """Predict breast cancer classification from uploaded image"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Preprocess image
        processed_image = preprocess_image(image_bytes)
        
        # Make prediction
        if model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        prediction = model.predict(processed_image)
        
        # Get prediction results
        probability = float(prediction[0][0])
        is_malignant = probability > 0.5
        diagnosis = "Malignant" if is_malignant else "Benign"
        confidence = "High" if abs(probability - 0.5) > 0.3 else "Medium" if abs(probability - 0.5) > 0.1 else "Low"
        
        # Generate explanation
        explanation = generate_explanation(probability, diagnosis, confidence)
        
        return {
            "probability": round(probability * 100, 2),
            "diagnosis": diagnosis,
            "confidence": confidence,
            "explanation": explanation,
            "benign_probability": round((1 - probability) * 100, 2),
            "malignant_probability": round(probability * 100, 2)
        }
        
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

def generate_explanation(probability: float, diagnosis: str, confidence: str) -> str:
    """Generate explanation for the prediction"""
    if diagnosis == "Malignant":
        if confidence == "High":
            return "Based on the analysis of the uploaded image, the system has identified strong characteristics consistent with malignant tissue patterns. Multiple indicators suggest cancerous growth."
        elif confidence == "Medium":
            return "The analysis shows some characteristics that may indicate malignant tissue, though the confidence level suggests further examination may be warranted."
        else:
            return "Some features in the image suggest potential malignant characteristics, but the low confidence level indicates the need for additional diagnostic procedures."
    else:
        if confidence == "High":
            return "The analysis indicates benign tissue characteristics with high confidence. The image shows normal cellular patterns consistent with healthy breast tissue."
        elif confidence == "Medium":
            return "The analysis suggests benign characteristics, though some features warrant attention. Regular monitoring is recommended."
        else:
            return "The image shows mostly benign characteristics, but the low confidence level suggests the need for follow-up examination."

@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded model"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_loaded": True,
        "model_type": "Convolutional Neural Network",
        "input_shape": model.input_shape,
        "output_shape": model.output_shape,
        "total_parameters": model.count_params()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
