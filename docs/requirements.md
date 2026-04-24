# 📋 VIGILANTE Resume Tailor: Flow Requirements

To ensure clear developmental goals and maintain the high standard of the VIGILANTE architecture, the following requirements have been strictly implemented across the tech stack.

---

## 1. Functional Requirements (FR)

These define the core operations that VIGILANTE must perform.

| ID | Requirement Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-1** | **Authentication** | Secure entry via Supabase SSR logic with email/password and magic links. | P0 |
| **FR-2** | **AI Analysis** | Deep parsing of PDF/DOCX using Gemini 3.1 Pro with structured JSON output. | P0 |
| **FR-3** | **Lethal Optimization** | Re-writing resume bullets to hit 90%+ ATS match for targeted keywords. | P0 |
| **FR-4** | **PDF Synthesis** | Dynamic generation of high-fidelity PDFs (LTR/RTL) via `@react-pdf/renderer`. | P1 |
| **FR-5** | **Cloud Persistence** | Automatic streaming of artifacts to Supabase Storage with RLS protection. | P1 |
| **FR-6** | **Email Dispatch** | Automated delivery of download links via Nodemailer/Resend upon completion. | P2 |

### 1.1 Deep Dive: AI Tailoring Protocol
- **FR-2.1**: The engine MUST parse incoming `.pdf` and `.docx` blobs returning sterile text strings.
- **FR-2.2**: The core AI (Gemini 3.1 Pro) MUST strictly return parsed data as pure, validated JSON corresponding to internal ATS models.
- **FR-2.3**: The AI MUST adapt to language switches (English / Arabic RTL) and preserve cultural nuances in professional phrasing.

---

## 2. Non-Functional Requirements (NFR)

These define the "quality" of the system.

### ⚡ NFR-1: Performance & Scalability
- **NFR-1.1**: **Async Processing**: Next.js route handling for `/api/tailor` must handle 30s+ timeouts for heavy AI compute.
- **NFR-1.2**: **Concurrency**: Utilize React 19 `useTransition` and `useOptimistic` to maintain 60fps UI responsiveness during heavy loads.
- **NFR-1.3**: **Cold Starts**: Optimize serverless functions to ensure <2s response time for non-AI routes.

### 🎨 NFR-2: Aesthetic Excellence
- **NFR-2.1**: **Dark Mode First**: The UI MUST consistently maintain a premium dark-mode identity using Glassmorphism and high-contrast typography.
- **NFR-2.2**: **Fluid i18n**: Internationalization mapping (LTR to RTL) MUST occur instantly without layout shift.
- **NFR-2.3**: **Micro-interactions**: Every button click and state change must have a tactile, animated feedback (Framer Motion).

### 🔒 NFR-3: Security & Compliance
- **NFR-3.1**: **Data Isolation**: Zero-leak guarantee between users via Supabase RLS.
- **NFR-3.2**: **Rate Limiting**: Prevent brute-force and API drain using Upstash Redis tokens.
- **NFR-3.3**: **Static Analysis**: Maintain 100% pass rate on ESLint and TypeScript strict mode.

---

## 3. Technical Constraints

- **Storage**: Individual user storage capped at 50MB of PDF artifacts.
- **AI Tokens**: Context window restricted to 32k tokens to prevent latency spikes.
- **Browser Support**: Optimized for Chromium-based browsers and Safari 15+.

> [!IMPORTANT]
> Any deviation from these requirements requires a formal Architecture Review Board (ARB) approval.
