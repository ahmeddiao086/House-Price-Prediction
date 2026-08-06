# 🏠 House Price Prediction — End-to-End ML Web App

Predicts Indian real-estate prices from listing details, using a scikit-learn
pipeline trained on the [House Price dataset](https://www.kaggle.com/datasets/juhibhojani/house-price)
by Juhi Bhojani (Kaggle), served through a FastAPI backend and a React frontend.

## Architecture

```
User → React (Vite) frontend  →  POST /predict  →  FastAPI backend  →  scikit-learn Pipeline (.pkl)
                                                                              ↑
                                                         trained in notebooks/house_price_model.ipynb
```

## Tech stack

| Layer      | Tech                                   |
|------------|-----------------------------------------|
| Modeling   | pandas, scikit-learn, joblib            |
| Backend    | FastAPI, pydantic-settings, uvicorn     |
| Frontend   | React 18, TypeScript, Vite, react-router-dom |

## Project structure

```
house-price-project/
├── notebooks/
│   └── house_price_model.ipynb   # data cleaning, training, evaluation, export
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app, CORS, model loaded at startup
│   │   ├── api/routes/prediction.py
│   │   ├── core/config.py
│   │   ├── schemas/prediction.py
│   │   └── services/{preprocessing,inference}.py
│   ├── models/house_price.pkl    # copy from the notebook output
│   ├── tests/test_prediction.py
│   └── requirements.txt
│   └── locations.json    # copy from the notebook output
└── frontend/
    ├── src/{api,components,pages,types}/
    └── public/locations.json     # copy from the notebook output
```

## Dataset

- Source: [House Price — Juhi Bhojani (Kaggle)](https://www.kaggle.com/datasets/juhibhojani/house-price)
- ~187k Indian property listings.
- Download it manually or via the Kaggle CLI and place `house_prices.csv` in `notebooks/dataset/`:

```bash
pip install kaggle
kaggle datasets download -d juhibhojani/house-price -p notebooks/dataset --unzip
```

## Setup

### 1. Notebook

```bash
cd notebooks
pip install pandas numpy scikit-learn matplotlib seaborn joblib jupyter
jupyter notebook house_price_model.ipynb
```

Running it end-to-end produces `house_price.pkl` and `locations.json`.
Copy `house_price.pkl` into `backend/models/` **and** copy `locations.json` into `backend/` too.

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Visit `http://localhost:8000/docs` to try `/predict` from the Swagger UI.

Run tests:

```bash
pytest
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`.

## Environment variables

**backend/.env**

| Variable          | Description                     | Default                      |
|--------------------|----------------------------------|-------------------------------|
| `MODEL_PATH`       | Path to the trained pipeline     | `models/house_price.pkl`      |
| `LOCATIONS_PATH`   | Path to allowed locations JSON   | `locations.json`       |
| `ALLOWED_ORIGINS`  | CORS-allowed frontend origin(s)  | `http://localhost:5173`       |

**frontend/.env**

| Variable              | Description               | Default                 |
|------------------------|----------------------------|--------------------------|
| `VITE_API_BASE_URL`   | Backend base URL           | `http://localhost:8000` |

## API reference

### `GET /health`

```json
{ "status": "ok" }
```

### `POST /predict`

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Sector 150 Noida",
    "total_area_sqft": 1200,
    "floor_clean": 3,
    "bathroom_clean": 2,
    "balcony_clean": 1,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
    "ownership": "Freehold",
    "facing": "East"
  }'
```

Response:

```json
{ "predicted_price": 6500000.0 }
```


## Screenshots

<img width=70% alt="image" src="https://github.com/user-attachments/assets/fddc044f-6452-4050-9683-971da371f73f" />
<img width=70% alt="image" src="https://github.com/user-attachments/assets/bdbae207-dafd-49bc-8ec6-4e514b143446" />


