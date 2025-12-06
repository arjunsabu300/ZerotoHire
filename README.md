
# 🚀 Zero-to-Hire: AI-Powered Job Simulation Platform

**MERN Stack | GROQ AI | Interactive Coding Workspace | Admin Analytics**


## 📌 Overview

**Zero-to-Hire** is an AI-driven recruitment simulation tool that helps candidates practice real-world job assessments based on actual job descriptions.

Using the GROQ LLM API, the system automatically:

* Extracts job skills, responsibilities, and role summary.
* Generates a coding assessment with test cases.
* Provides an AI assistant that gives **hints (not answers)**.
* Tracks attempts, runtime, hint usage, and improvements.
* Scores the final submission and generates a detailed performance report.

Admins can view **analytics**, including:

* Top candidates
* Average scores
* Attempts & hints usage
* Job difficulty index

---

## 🧠 Key Features

| Feature                        | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| 📝 Job Description Input       | Paste a job post and let AI break it down.                |
| 🤖 AI Job Breakdown            | Extracts skills, responsibilities, summary & job title.   |
| 💻 Coding Simulation Workspace | Code editor with test running and validation.             |
| 🧪 Auto Generated Testcases    | Visible + hidden tests with a final scoring system.       |
| 💬 AI Helper (Hint Mode)       | Helps candidates learn without giving the full solution.  |
| 📊 Scorecard Generation        | Provides performance insights and improvement points.     |
| 🧾 Shareable Credentials       | Every candidate receives a public skill credential link.  |
| 🔐 Simple Login System         | Candidate login + Admin login (secret key).               |
| 📈 Admin Dashboard             | View job analytics, simulation stats, and top performers. |

---

## 🏗 Tech Stack

### Frontend

* React + Vite
* TailwindCSS
* CodeMirror Editor
* LocalStorage Auth (Simple Mode)

### Backend

* Node.js + Express
* MongoDB + Mongoose
* GROQ AI SDK
* Custom scoring logic + test runner

---

## 🔧 Installation & Setup

### 1️⃣ Clone Repo

```bash
git clone https://github.com/YOUR_USERNAME/zerotohire.git
cd zerotohire
```

---

### 2️⃣ Install Dependencies

#### Backend:

```bash
cd src/backend
npm install
```

#### Frontend:

```bash
cd ../../
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in `src/backend/`:

```
MONGO_URI=YOUR_MONGODB_URI
GROQ_API_KEY=YOUR_GROQ_API_KEY
SERVER_URL=http://localhost:5000
```

Optional (Frontend):

`.env` (for optional admin code override)

```
VITE_ADMIN_CODE=YOUR_SECRET_CODE
```

---

### 4️⃣ Run Development Environment

#### Backend:

```bash
npm run server
```

#### Frontend:

```bash
npm run dev
```

---

## 🛠 Project Structure

```
src/
 ├─ backend/
 │   ├─ models/
 │   ├─ routes/
 │   ├─ config/
 │   ├─ services/
 │   └─ server.js
 ├─ pages/
 ├─ components/
 ├─ utils/
 └─ App.jsx
```

---

## 🧪 Example Workflow

1. **Candidate logs in with their name**
2. Pastes a job description
3. AI extracts skills + generates coding task
4. Candidate solves task inside editor
5. Runs tests → receives pass/fail feedback
6. Uses AI helper when stuck
7. Submits solution → system scores and generates performance report
8. Candidate can share their **credential report link**
9. Admin logs in and views analytics across all candidates

---

## 👤 Authentication Model

No JWT or OAuth for simplicity.

| Role      | Method                                                |
| --------- | ----------------------------------------------------- |
| Candidate | Enters name → stored in localStorage                  |
| Admin     | Enters secret code → `isAdmin=true` stored in storage |

---

## 📊 Admin Dashboard Features

* Job-based analytics
* Candidate ranking list
* Attempts tracking analysis
* Average hint usage
* Score distribution insights

---

## 🚀 Deployment

Recommended Setup:

| Service                      | Purpose          |
| ---------------------------- | ---------------- |
| 🖥 Vercel                    | Frontend hosting |
| 🛰 Render / Railway / Fly.io | Backend hosting  |
| 🍃 MongoDB Atlas             | Database         |

> If using Render free tier, backend might sleep. A warm-up ping request is included.

---

## 📌 Future Improvements

* JWT authentication
* Admin CRUD for job listings
* Multi-question exam mode
* Leaderboards + difficulty calibration
* Resume export + profile scoring

---

## 🤝 Contribution

Pull requests are welcome. For significant changes, please discuss via issue first.

---

## 📜 License

MIT License — feel free to modify, build on, or adapt.

---

## ⭐ Support

If this helped you or you showcased it in a buildathon:
👉 Star the repo and share it!

---

### 💡 Final Note

> This project demonstrates practical knowledge in **AI integration, full-stack engineering, UI/UX simulation, and backend logic design** — ideal for portfolios and hiring challenges.


