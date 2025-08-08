@echo off
echo Setting up MetaSelect Backend...

echo.
echo 1. Creating virtual environment...
python -m venv backend/venv

echo.
echo 2. Activating virtual environment...
call backend\venv\Scripts\activate.bat

echo.
echo 3. Installing dependencies...
cd backend
pip install -r requirements.txt

echo.
echo 4. Backend setup complete!
echo.
echo To start the backend server:
echo 1. cd backend
echo 2. venv\Scripts\activate.bat
echo 3. python start.py
echo.
echo The server will be available at: http://localhost:8000
echo API documentation: http://localhost:8000/docs

pause




