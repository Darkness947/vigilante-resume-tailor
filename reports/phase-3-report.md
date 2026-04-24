# 🧠 Phase 3: The Engine Room - Parsing & AI Integration
*Vigilante Resume Tailor: Gemini Deep Integration*

---

## 🎯 Executive Summary
Phase 3 was the technical heart of the project: breathing life into the AI Tailoring Engine. We bridged document extraction logic with Google's advanced Gemini 3.1 Pro models. The protocol was designed to extract raw data, understand contextual job requirements, and forcefully restructure the user's career narrative to bypass modern ATS filters.

---

## 🔬 Technical Challenges & Resolutions

| Challenge | Impact | Resolution |
| :--- | :--- | :--- |
| **Parsing Binary Blobs** | Critical | Developed a dual-parser system using `unpdf` for PDF streams and `mammoth` for DOCX XML structures. |
| **AI Hallucinations** | High | Implemented "Few-Shot" prompting and strict JSON schema enforcement to ensure 100% valid data output. |
| **Context Window Limits** | Medium | Engineered an "Aggressive Trimmer" to strip metadata and non-essential whitespace before AI induction. |

---

## 🧠 Core Processing Pipeline

### 1. Document Extraction (`/api/parse`)
To ensure high accuracy regardless of the user's initial file type:
- **PDF Protocol**: Utilizes `unpdf` to extract clean text while preserving block relationships.
- **DOCX Protocol**: Utilizes `mammoth` to convert Office Open XML into sterile strings.
- **Sanitization**: All extracted text is normalized to UTF-8 and stripped of non-printable control characters.

### 2. Gemini System Directives (`gemini.ts`)
The heartbeat of the system relies on highly specific AI Prompt Engineering.
- **Roleplay**: The AI is instructed to act as a "Senior Technical Recruiter & ATS Expert."
- **Matching Logic**: The AI performs a "Gap Analysis" between the Resume and the Job Description, identifying missing keywords and quantifiable metrics.
- **Output**: Pure, minified JSON. No conversational fluff, no metadata—just raw, structured career data.

### 3. Serverless Execution
- Leveraged Next.js Route Handlers with increased memory limits to process large resumes.
- Implemented `edge` runtime where possible to minimize latency between the user and the Gemini API.

---

## 📈 Phase Outcomes
The intelligent core of VIGILANTE is operational. It can intake a chaotic resume, compare it against a target Job Description, and output a flawlessly structured, keyword-optimized JSON data map.

> **Status: ENGINE CORE CRITICAL**
