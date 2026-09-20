# TailorPOS Backend

Production-style backend for TailorPOS.
Built with FastAPI and MySQL.

## Requirements
- Python 3
- MySQL Database

## Setup Instructions (Windows)

1. **Create Database**
   Ensure MySQL is running. Create a database named `tailorpos`:
   ```sql
   CREATE DATABASE IF NOT EXISTS tailorpos;
   ```

2. **Configure Environment**
   Rename `.env.example` to `.env` and fill in your MySQL credentials (like `DB_PASSWORD`).

3. **Install Dependencies**
   ```cmd
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Run Seed Script (Initializes DB and Mock Data)**
   ```cmd
   python seed.py
   ```

5. **Start Server**
   ```cmd
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **View API Documentation**
   Open in your browser:
   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

## Connecting Android Device
- If using an Android Emulator on the same PC, the frontend API base URL is `http://10.0.2.2:8000/api`.
- If using a physical Android device on the same Wi-Fi, change the `BASE_URL` in `src/services/api/axiosInstance.js` to your PC's IP address (e.g. `http://192.168.1.100:8000/api`).

