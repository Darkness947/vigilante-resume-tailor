# Phase 3: The Engine Room - Parsing & AI Integration
*Vigilante Resume Tailor: Gemini Deep Integration*

---

## 🎯 Executive Summary
Phase 3 was the most complex technical phase of the project: breathing life into the AI Tailoring Engine. We successfully bridged document extraction logic with Google's advanced Gemini 3.1 Pro models. The protocol was designed to extract raw data, understand contextual job requirements, and forcefully restructure the user's career narrative.

## 🧠 Core Processing Pipeline

### 1. Document Extraction (`/api/parse`)
To ensure high accuracy regardless of the user's initial file type, we developed a robust parsing API:
- Integrated `pdf-parse` buffer streams to rip text directly from raw PDF uploads.
- Integrated `mammoth` for comprehensive internal extraction of standard `.docx` files.
- The pipeline immediately sanitizes character encodings and aggressively trims whitespace to prevent context-window exhaustion.

### 2. Gemini System Directives (`gemini.ts`)
The heartbeat of the system relies on highly specific AI Prompt Engineering.
- **Strict JSON Enforcement**: We mandated that the Gemini model strictly return pure `json` structured accurately against a defined `Zod` validation schema. 
- **The Persona**: We instructed the AI to act as an elite, ruthless ATS (Applicant Tracking System) optimizer. It was tuned to forcefully eradicate buzzwords, explicitly match targeted keywords, and heavily bias towards quantifiable impact metrics.

### 3. Serverless Execution 
- We utilized Next.js Route Handlers (`/api/tailor/route.ts`) to maintain severe timeouts and heavy memory allocations required when streaming large data structures from the Gemini APIs.

## 📈 Phase Outcomes
The intelligent core of VIGILANTE is operational. It can intake a chaotic, poorly formatted resume, compare it against a target Job Description, and output a flawlessly structured, quantifiable, keyword-optimized JSON data map.
