# MetaSelect FastAPI Integration Guide

This guide explains how the FastAPI backend has been integrated with your Next.js frontend for breast cancer classification.

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   Next.js       │ ◄─────────────► │   FastAPI       │
│   Frontend      │                 │   Backend       │
│   (Port 3000)   │                 │   (Port 8000)   │
└─────────────────┘                 └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   TensorFlow    │
                                    │   Model         │
                                    │ (best_model.h5) │
                                    └─────────────────┘
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Windows
setup-backend.bat

# Unix/Mac
chmod +x setup-backend.sh
./setup-backend.sh
```

### 2. Start Backend Server

```bash
cd backend
# Windows
venv\Scripts\activate.bat

# Unix/Mac
source venv/bin/activate

python start.py
```

### 3. Start Frontend

```bash
npm run dev
```

### 4. Test the Integration

```bash
cd backend
python test_api.py
```

## 🔧 API Endpoints

### Health Check
- **URL**: `GET /health`
- **Purpose**: Verify API status and model loading
- **Response**: 
```json
{
  "status": "healthy",
  "model_loaded": true,
  "message": "API is ready for predictions"
}
```

### Model Information
- **URL**: `GET /model-info`
- **Purpose**: Get model details
- **Response**:
```json
{
  "model_loaded": true,
  "model_type": "Convolutional Neural Network",
  "input_shape": [null, 224, 224, 3],
  "output_shape": [null, 1],
  "total_parameters": 1234567
}
```

### Image Prediction
- **URL**: `POST /predict`
- **Purpose**: Classify breast cancer images
- **Request**: Multipart form with image file
- **Response**:
```json
{
  "probability": 85.5,
  "diagnosis": "Malignant",
  "confidence": "High",
  "explanation": "Based on the analysis...",
  "benign_probability": 14.5,
  "malignant_probability": 85.5
}
```

## 🔄 Frontend Integration

### API Communication (`lib/api.js`)

The frontend uses a centralized API utility for all backend communication:

```javascript
import { api } from '@/lib/api'

// Health check
const health = await api.healthCheck()

// Get model info
const modelInfo = await api.getModelInfo()

// Predict image
const results = await api.predictImage(file)
```

### Real-time Status Monitoring

The frontend automatically:
- Checks API connectivity on load
- Shows connection status indicator
- Disables prediction button when API is unavailable
- Displays error messages for failed requests

### Error Handling

Comprehensive error handling includes:
- Network connectivity issues
- Model loading failures
- Invalid file uploads
- Server errors

## 🎯 Key Features

### 1. Model Integration
- Automatic model loading on startup
- Support for `.h5` TensorFlow models
- Image preprocessing (resize, normalize)
- Real-time predictions

### 2. Image Processing
- Multiple image format support (PNG, JPG, etc.)
- Automatic resizing to 224x224 pixels
- RGB conversion and normalization
- Batch processing ready

### 3. CORS Configuration
- Configured for local development
- Supports multiple origins
- Secure credential handling

### 4. API Documentation
- Interactive Swagger UI at `/docs`
- Alternative ReDoc at `/redoc`
- Auto-generated from code

## 🔍 Testing

### Automated Tests
Run the test suite to verify everything works:

```bash
cd backend
python test_api.py
```

### Manual Testing
1. Start both servers
2. Upload an image in the frontend
3. Check the prediction results
4. Verify API documentation at `http://localhost:8000/docs`

## 🛠️ Troubleshooting

### Common Issues

1. **Model not found**
   - Ensure `best_model.h5` is in the project root
   - Check file permissions

2. **Port conflicts**
   - Backend: Change port in `start.py`
   - Frontend: Change port in `package.json`

3. **CORS errors**
   - Verify CORS configuration in `main.py`
   - Check frontend URL in allowed origins

4. **Dependencies issues**
   - Reinstall requirements: `pip install -r requirements.txt`
   - Check Python version (3.8+ required)

### Debug Mode

Enable debug logging in the backend:

```python
# In main.py
logging.basicConfig(level=logging.DEBUG)
```

## 📊 Performance

### Optimization Tips

1. **Model Loading**: Model loads once on startup
2. **Image Processing**: Efficient PIL/OpenCV operations
3. **Memory Management**: Proper cleanup of image data
4. **Async Processing**: Non-blocking API endpoints

### Monitoring

Monitor API performance with:
- Health check endpoint
- Model info endpoint
- Server logs

## 🔒 Security

### Current Security Features

1. **Input Validation**: File type and size checks
2. **Error Handling**: No sensitive data exposure
3. **CORS Protection**: Configured origins only

### Recommended Enhancements

1. **Authentication**: Add API key or JWT tokens
2. **Rate Limiting**: Implement request throttling
3. **HTTPS**: Use SSL in production
4. **Input Sanitization**: Enhanced file validation

## 🚀 Deployment

### Backend Deployment

1. **Docker** (Recommended):
   ```dockerfile
   FROM python:3.9-slim
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Cloud Platforms**:
   - Heroku
   - Railway
   - DigitalOcean App Platform
   - AWS Lambda

### Environment Variables

```env
MODEL_PATH=/path/to/best_model.h5
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## 📈 Future Enhancements

1. **Model Versioning**: Support multiple model versions
2. **Batch Processing**: Handle multiple images
3. **Caching**: Redis for prediction caching
4. **Metrics**: Prometheus/Grafana monitoring
5. **Webhooks**: Real-time notifications
6. **Model Updates**: Hot model reloading

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Run the test suite
4. Check API documentation

The integration is now complete and ready for production use! 🎉




