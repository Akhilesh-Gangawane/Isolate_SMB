# 🚀 Isolate — Quickstart Guide (Clone & Run)

Welcome to **Isolate** — Autonomous Multi-Agent AI Operations Platform.

Follow these simple steps to clone, configure, and run the complete application locally.

---

## ⚡ Option 1: Quickstart (Windows PowerShell) — 1 Command

Once you have cloned the repository, open PowerShell in the project directory and run:

```powershell
.\start.ps1
```

### What `start.ps1` does automatically:
1. **Auto-creates `.env` files** from `.env.example` templates if missing.
2. **Creates Python virtual environment (`venv`)** and installs all dependencies from `requirements.txt`.
3. **Installs frontend dependencies (`npm install`)** if missing.
4. **Seeds initial database fixtures** (email fixtures, tenant accounts, demo deals).
5. **Starts FastAPI backend** on `http://127.0.0.1:8000`.
6. **Starts Vite frontend** on `http://localhost:5173`.
7. **Monitors system health** and opens the live dashboard.

---

## 🛠️ Option 2: Manual Step-by-Step Setup

If you prefer to run services manually or are on macOS/Linux:

### 1. Prerequisites
* **Python 3.10+**
* **Node.js 18+ & npm**
* *(Optional)* Docker (for Redis container, or run Redis natively)

---

### 2. Configure Environment Files

```bash
# In the project root
cp .env.example .env

# In the frontend folder
cp frontend/.env.example frontend/.env
```

---

### 3. Backend Setup

```bash
# 1. Create and activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Seed email & tenant data
python db/seed/email_seed.py

# 4. Start the FastAPI backend
python main.py api
```

Backend will be running at:
* **API Base:** `http://127.0.0.1:8000`
* **Swagger Docs:** `http://127.0.0.1:8000/docs`
* **Health Check:** `http://127.0.0.1:8000/api/v1/health`

---

### 4. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at:
* **Dashboard:** `http://localhost:5173`

---

## 🔐 Default Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Platform Admin (Recommended)** | `admin@isolate.com` | `admin123` |
| **Platform Admin (Legacy)** | `admin@smbflow.com` | `admin123` |

---

## 🧭 Key Features & Navigation

* **Workflow DAG Builder:** Dynamic multi-agent visual graph editor with undo/redo, connection line animations, and collapsible sidebars at `/workflows/builder`.
* **Operations Copilot:** Natural language AI assistant at `/admin/copilot` or `/copilot`.
* **Platform Overview:** Real-time health metrics, tenant directory, and audit traces at `/admin`.
* **Action Center:** Human-in-the-loop review queue for escalations and AI agent proposals at `/escalations`.
