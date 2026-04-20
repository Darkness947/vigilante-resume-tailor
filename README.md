# 🔥 VIGILANTE Resume Tailor.

> **"Advanced Targeting. Lethal Optimization."**

Vigilante is a full-stack, enterprise-grade Next.js application that ruthlessly optimizes unformatted resumes against targeted Applicant Tracking Systems (ATS). Built securely on the Vercel architecture.

---

## ⚡ Core Features

-   **Deep AI Integration**: Leverages Google Gemini 3.1 Pro APIs to forcefully strip, rewrite, and structure scattered career data.
-   **Dynamic Localized Rendering**: Uses `@react-pdf/renderer` to universally compile pristine PDFs dynamically supporting **both English (LTR) and Arabic (RTL)** output templates.
-   **Automated Email Dispatch**: Natively hooked into Nodemailer processing fresh signed download URLs mapping directly to individual users' email inboxes instantly after a successful generation.
-   **Next-Gen Security Walls**: Locked down with Next.js specific SSR JWTs mapping directly to Row Level Security (RLS) PostgreSQL bounds within Supabase.

---

## 📂 Documentation Registry

The engineering process, decisions, and system diagrams are heavily documented. Explore the repository boundaries below:

### 1. Developer Reports (`/reports`)
1.  [Phase 0: Foundation & Infrastructure](reports/phase-0-report.md)
2.  [Phase 1: Identity & Authentication](reports/phase-1-report.md)
3.  [Phase 2: Visual Identity & LTR/RTL Logic](reports/phase-2-report.md)
4.  [Phase 3: Deep AI Parsing Workflow](reports/phase-3-report.md)
5.  [Phase 4: Output Compilation Engine](reports/phase-4-report.md)
6.  [Phase 5: Secure Application Boundaries](reports/phase-5-report.md)
7.  [Phase 6: Final Optimizations & Automated Dispatch](reports/phase-6-report.md)

### 2. Standard Docs (`/docs`)
-   [Requirements Matrix](docs/requirements.md)
-   [Operational Walkthrough](docs/walkthrough.md)
-   [Final Documentation Docs](docs/final_documentation.md)

### 3. Architecture Blueprints (`/diagrams`)
-   [System Architecture Overview](diagrams/system-architecture.md)
-   [Core AI Tailoring Workflow](diagrams/ai-tailoring-workflow.md)
-   [Automated Email Pipeline](diagrams/automated-dispatch.md)
-   [Supabase Database Schema Map](diagrams/database-schema.md)
-   [Authentication & Security Walls](diagrams/auth-rls.md)

---

### Build Constraints
The application enforces strict build rules out-of-the-box (`npm run lint`). Code will not execute locally or deploy successfully with unused variable remnants or memory leak hazards.
