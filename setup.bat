@echo off
echo ========================================
echo Lost and Found System Setup for Windows
echo ========================================

echo.
echo [1/4] Setting up Backend...
cd backend
call npm init -y
call npm install express cors dotenv helmet morgan multer bcryptjs jsonwebtoken cloudinary
call npm install -D nodemon mysql2
echo Backend dependencies installed!

echo.
echo [2/4] Setting up Frontend...
cd ..\frontend
call npx create-react-app . --use-npm
call npm install axios react-router-dom react-hot-toast
echo Frontend created!

echo.
echo [3/4] Creating environment files...
cd ..\backend
echo PORT=5000 > .env
echo DATABASE_URL="mysql://root:@localhost:3306/lost_found_db" >> .env
echo JWT_SECRET="change-this-secret-key" >> .env
echo JWT_EXPIRES_IN="7d" >> .env

cd ..\frontend
echo REACT_APP_API_URL=http://localhost:5000/api > .env

echo.
echo [4/4] Setup Complete!
echo.
echo To start the application:
echo 1. Start XAMPP MySQL
echo 2. Backend: cd backend ^&^& npm run dev
echo 3. Frontend: cd frontend ^&^& npm start
echo.
pause