
# 🌾 Crop Disease Detection | MERN Stack + FastAPI + CNN + AI

A full-stack web application to detect plant diseases from images and provide actionable insights like symptoms, causes, treatments, and prevention measures — along with crop-specific farming tips.

---

## 📌 Project Overview

This project leverages **Machine Learning**, **FastAPI**, and the **MERN stack** to enable:

- 📷 **Image-based disease detection**
- 💡 **Smart disease insights & tips**
- 🌿 **Crop-wise farming guide**
- 🧠 **Deep learning model (CNN)**
- 🔒 **Authentication & scan history tracking**

Though not fully complete, this is a functional project built with learning at its core — covering end-to-end integration of ML with web technologies.

---

## 🚀 Features Implemented

### ✅ Machine Learning
- Trained CNN model using TensorFlow/Keras
- Achieved **87.97% validation accuracy**
- Covers **38 plant disease classes**
- Pre-trained `.h5` model served via FastAPI

### ✅ Backend (FastAPI + Express.js)
- `/predict`: ML image inference route
- `/plants`, `/diseases`, `/disease-info`: info routes
- MongoDB storage for user scans
- User authentication with JWT
- Crop knowledge API from JSON data

### ✅ Frontend (React + Vite + TailwindCSS)
- Upload images and detect diseases
- Display prediction + confidence
- Show symptoms, causes, treatment, prevention
- Manual plant/disease search
- Crop farming guide by category
- Beautiful, responsive UI

---

## 🔗 Architecture

```
[Frontend: React + Tailwind]
          |
          V
[Backend: Express API]
          |
          |----------------------------\
          |                            |
          V                            V
[MongoDB for auth/scan history]     [ML API: FastAPI + TensorFlow]
```

---

## 📂 Project Structure

```
SCA-PROJECT/
│
├── model/                # ML model and FastAPI
│   ├── app.py            # FastAPI inference server
│   ├── disease_info.py   # Disease details DB
│   ├── saved_models/     # Trained CNN model (.h5)
│
├── sp-backend/           # Express.js API
│   ├── src/              # Auth, scan, prediction, crop routes
│   ├── app.js
│   ├── .env              # Env variables
│
├── sp-frontend/          # React UI
│   ├── src/              # Pages, components, stores
│   ├── axios.js          # Dual axios setup for backend + ML
│   ├── vite.config.js
│
├── requirements.txt      # FastAPI server dependencies
```

---

## 🧪 Sample Model Output

```
{
  "plant_name": "Tomato",
  "is_healthy": false,
  "disease": "Tomato___Early_blight",
  "confidence": 0.934,
  "disease_details": {
    "symptoms": ["Dark lesions", "Yellowing leaves", "..."],
    "causes": ["Fungal infection", "High humidity", "..."],
    "treatment": ["Fungicides", "Prune infected parts", "..."],
    "prevention": ["Crop rotation", "Avoid overhead watering", "..."]
  }
}
```

---

## ⚙️ Technologies Used

| Stack       | Tech                                      |
|-------------|-------------------------------------------|
| ML/AI       | TensorFlow, Keras, FastAPI, Pillow        |
| Backend     | Node.js, Express.js, MongoDB, Mongoose    |
| Frontend    | React, Vite, Tailwind CSS, Zustand, Axios |
| Auth        | JWT, CookieParser                         |
| Dev Tools   | Render, GitHub, Postman, VSCode           |

---

## 📉 Limitations

- ML model served locally — not deployed on cloud
- 5MB image size limit
- Partial disease database (can be expanded)
- Limited language support
- Some UI sections still in development
- No cloud hosting yet (Render planned)

---

## 💡 Planned Improvements

- [ ] Dockerize entire project
- [ ] Deploy ML model on GPU cloud (e.g., Hugging Face or Render)
- [ ] Add crop-weather correlation
- [ ] Offline support for mobile use
- [ ] Voice input support for farmers
- [ ] More crop tips & regional languages

---

## 📸 Screenshots

> *(Include screenshots or a Loom video demo here)*

---

## 📜 How to Run Locally

1. Clone repo
2. Setup virtual environment for FastAPI (inside `model/`)
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   cd sp-backend && npm install
   cd sp-frontend && npm install
   ```
4. Create `.env` in `sp-backend` with MongoDB, JWT keys, etc.
5. Start ML server:
   ```bash
   cd model
   python app.py
   ```
6. Start backend:
   ```bash
   cd sp-backend
   npm run dev
   ```
7. Start frontend:
   ```bash
   cd sp-frontend
   npm run dev
   ```

---

## 🙏 Acknowledgements

- [PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease)
- TensorFlow & FastAPI documentation
- OpenAI (for code reasoning & generation)
- Cursor AI for in-editor guidance
- Render for planned deployment

---

## ✨ Author

**Amogh Pitale (SteamonAP)**  
[GitHub](https://github.com/SteamonAP)
