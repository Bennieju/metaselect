# MetaSelect FastAPI Backend

This is the FastAPI backend for the MetaSelect breast cancer classification application.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Verify Model File

Make sure the `best_model.h5` file is in the parent directory (root of the project).

### 3. Start the Server

```bash
# Option 1: Using the start script
python start.py

# Option 2: Using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start on `http://localhost:8000`

### 4. API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- Alternative API docs: `http://localhost:8000/redoc`

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running and model is loaded

### Model Information
- `GET /model-info` - Get information about the loaded model

### Prediction
- `POST /predict` - Upload an image and get breast cancer classification

## Environment Variables

You can set the following environment variables:
- `MODEL_PATH` - Path to the model file (default: `../best_model.h5`)

## Troubleshooting

1. **Model not found**: Make sure `best_model.h5` is in the correct location
2. **Port already in use**: Change the port in `start.py` or kill the process using port 8000
3. **Dependencies issues**: Make sure you're using Python 3.8+ and have all requirements installed

## Development

The server runs with auto-reload enabled, so changes to the code will automatically restart the server.




