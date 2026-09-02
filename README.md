<h1>🇮🇳 Antim Rupee</h1>
  
  <p><strong>Scalable AI Platform for Consolidating Citizen Feedback & Infrastructure Planning.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud" />
    <img src="https://img.shields.io/badge/Gemini_1.5_Pro-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini" />
    <img src="https://img.shields.io/badge/Vertex_AI-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Vertex AI" />
    <img src="https://img.shields.io/badge/BigQuery-669DF6?style=for-the-badge&logo=google-cloud&logoColor=white" alt="BigQuery" />
  </p>
</div>

---

## 🚨 The Problem

Governments across India struggle to consolidate citizen feedback and align it with national infrastructure priorities. Development requests live in fragmented systems, leading to misaligned public spending, unaddressed infrastructure gaps, and no way to measure the impact of large-scale digital public infrastructure initiatives.

---

## 💡 The Solution

**Antim Rupee** is a scalable, multilingual AI platform — designed as a Digital Public Good — that aggregates citizen development requests via voice, text, and messaging apps across diverse linguistic regions of India. 
The system analyzes large datasets combining citizen feedback with national demographic data, infrastructure indices, and public investment plans, surfacing demand hotspots and recommending high-priority development projects to national policymakers.

### ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🎙️ **Multilingual Ingestion** | **Cloud Speech-to-Text** & **Translation API** transcribe and normalize citizen voices from WhatsApp, Telegram, and Web. |
| 🧠 **AI Extraction & Vision** | **Gemini 1.5 Pro** and **Vertex AI Vision** extract intent (e.g., Road Repair) and validate citizen photos of infrastructure issues. |
| 🗺️ **Demand Heatmaps** | Aggregates and visualizes citizen demand across districts using **Google Maps Platform** and **Earth Engine**. |
| 📋 **Predictive Project Recommendations** | **Vertex AI (AutoML)** and **BigQuery** cross-reference demand with public data (Census, Gati Shakti) to forecast and recommend optimal infrastructure projects. |

---

## 🚀 Running and Deploying

### 💻 Local Development

**1. Backend (API)**
```bash
cd api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**2. Frontend (Web)**
```bash
cd web
npm install
npm run dev
```

<div align="center">
  <sub>Built with ❤️ for Bharat.</sub>
</div>
