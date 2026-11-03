# Muspara AI

Muspara AI is an advanced spatial AI study environment and document intelligence platform designed to bridge visual diagrams and contextual understanding. Unlike traditional RAG chatbots or basic document viewers, Muspara AI provides automated page-by-page difficulty grading, custom spatial diagram extraction via a precision Magic Wand, automated interactive knowledge graphs, and context-aware page-specific AI tutoring for deep cognitive retention.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Features](#core-features)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Step-by-Step Installation & Local Setup](#step-by-step-installation--local-setup)
   - [Step 1: Clone the Repository](#step-1-clone-the-repository)
   - [Step 2: Backend Setup & Configuration](#step-2-backend-setup--configuration)
   - [Step 3: Frontend Setup & Configuration](#step-3-frontend-setup--configuration)
   - [Step 4: Running the Development Servers](#step-4-running-the-development-servers)
6. [Environment Variables Reference](#environment-variables-reference)
7. [License](#license)

---

## Architecture Overview

The platform is structured as a monorepo consisting of a modern frontend interface and a high-performance backend intelligence service:

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, HTML5 Canvas
- **Backend:** Python, FastAPI, Meta Model API Integration, Asynchronous Processing

---

## Core Features

- **Automated Page-by-Page Difficulty Detection:** Evaluates document complexity upon ingestion, classifying pages into Easy, Medium, or Hard difficulty tiers with analytical reasoning.
- **Spatial Magic Wand & Visual Extraction:** Enables users to draw precision bounding boxes over complex diagrams, circuits, or equations for targeted visual analysis.
- **Page-Specific Contextual AI Tutoring:** Anchors interactive tutoring directly to the active document page, maintaining strict alignment with current study material.
- **Automated Interactive Knowledge Graphs:** Parses study texts to extract core concepts, relationships, and structured notes into dynamic visual webs.
- **Zero-Storage Ephemeral Architecture:** Engineered for high-performance streaming and secure document processing without retaining raw files in persistent server storage.

---

## Prerequisites

Ensure the following tools are installed on your local machine before proceeding:

- Node.js (v18.0.0 or higher)
- Python (v3.10 or higher)
- Git

---

## Project Structure

```text
muspara-ai/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── app/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

---

## Step-by-Step Installation & Local Setup

### Step 1: Clone the Repository

Open your terminal and clone the public repository to your local development environment:

```bash
git clone https://github.com/prabashvijayanga/muspara-ai.git
cd muspara-ai
```

### Step 2: Backend Setup & Configuration

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a Python virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

**Windows (Command Prompt / PowerShell):**

```bash
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

4. Install the required Python dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

5. Configure environment variables:

Create a new file named `.env` inside the `backend/` directory and add your Meta Model API configuration:

```env
META_MODEL_API_KEY=your_actual_api_key_here
PORT=8000
```

6. Run the FastAPI development server:

```bash
uvicorn main:app --reload --port 8000
```

The backend service will now be running locally at `http://localhost:8000`.

### Step 3: Frontend Setup & Configuration

1. Open a new terminal window or tab, and navigate to the frontend directory from the root project folder:

```bash
cd frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Configure environment variables (if required):

Create a `.env.local` file inside the `frontend/` directory to define your API endpoint:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Step 4: Running the Development Servers

With both environments configured, start the Next.js development server:

```bash
npm run dev
```

The application will be accessible via your web browser at `http://localhost:3000`.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `META_MODEL_API_KEY` | Authentication token for accessing Meta Model APIs | Yes |
| `PORT` | Port number on which the FastAPI server listens | No (Default: 8000) |

### Frontend (`frontend/.env.local`)

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL routing client requests to the FastAPI backend | Yes |

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.