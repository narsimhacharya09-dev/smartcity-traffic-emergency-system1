# SmartCity Local Development & Testing Guide

## Local Prerequisites
- Python 3.9+
- Node.js 18+ and npm
- Docker & Docker Compose (Optional)

---

## 1. Backend Setup & Run

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI Uvicorn Server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Swagger API documentation will be accessible at `http://localhost:8000/docs`.

---

## 2. Train AI/ML Model

```bash
# Generate synthetic dataset and train RandomForest model
python ml/training/train_model.py
```

---

## 3. Frontend Setup & Run

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 4. Run Automated Pytest Suite

```bash
python -m pytest backend/tests
```

---

## 5. Docker Compose Deployment

```bash
docker-compose up --build
```
