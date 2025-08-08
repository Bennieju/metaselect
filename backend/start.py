import uvicorn
import os
import sys

if __name__ == "__main__":
    # Add the parent directory to the path so we can access the model file
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Run the FastAPI server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )




