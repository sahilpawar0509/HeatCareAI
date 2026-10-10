<div align="center">

# 🌡️ HeatCare AI

### Predicting Hospital Demand During Extreme Heat

**Hackathon Problem ID: HC-02**

![Project](https://img.shields.io/badge/Project-Prototype-2563eb?style=for-the-badge)
![Domain](https://img.shields.io/badge/Domain-AI%20%7C%20Healthcare-0ea5e9?style=for-the-badge)
![Climate](https://img.shields.io/badge/Climate-Resilience-14b8a6?style=for-the-badge)

*Supporting smarter healthcare preparedness during extreme heat.*

</div>

---

## 👥 Meet Our Team

<div align="center">

### 🚀 Team HeatCare AI

*Building smarter healthcare preparedness through AI and data.*

| Role | Name |
|:---:|:---|
| 👑 **Team Lead** | **Sahil Pawar** |
| 💻 Team Member | Sanchita Jadhav |
| 💻 Team Member | Richal Gole |
| 💻 Team Member | Om Gate |

<br/>

**Hackathon Problem ID:** HC-02  
**Project:** HeatCare AI  
**Domain:** AI · Healthcare · Climate Resilience

</div>

---

---

## 🎯 Problem Statement

Extreme heat can increase heat-related illnesses and emergency visits, putting pressure on hospital beds, medical staff, and essential resources.

Hospitals need better ways to anticipate potential demand and prepare in advance.

## 💡 Our Proposed Solution

**HeatCare AI** is a healthcare preparedness dashboard that combines environmental information, hospital data, and experimental demand forecasts in one place.

It aims to help healthcare teams monitor heat-related conditions, review expected demand, check resource availability, and identify potential pressure points.

## ✨ Key Features

- 📊 **Dashboard Overview** — Important heat and healthcare indicators.
- 🤖 **Demand Forecasting** — Experimental short-term hospital-demand forecasts.
- 🏥 **Capacity Monitoring** — Overview of hospital capacity and resources.
- 🚨 **Risk Indicators** — Highlight potential demand pressure.
- 🌤️ **Weather Context** — Environmental information for heat monitoring.
- 🗺️ **Interactive Map** — Visualise NASA FIRMS satellite thermal-anomaly detections.
- 📈 **Visual Analytics** — Charts and summaries for easier interpretation.

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Python, FastAPI |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn |
| Charts | Recharts |
| Maps | React Leaflet, Leaflet |
| Data Sources | Demonstration hospital data and configured environmental APIs |

## 🏗️ System Architecture

```text
      ENVIRONMENTAL DATA + HOSPITAL DATA
                     │
                     ▼
              FASTAPI BACKEND
                     │
                     ▼
         DATA PROCESSING & FORECASTING
                     │
                     ▼
              REACT DASHBOARD
                     │
                     ▼
       FORECASTS · RESOURCES · INDICATORS
