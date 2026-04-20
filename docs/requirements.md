# VIGILANTE Resume Tailor: Flow Requirements

To ensure clear developmental goals and maintain the high standard of the VIGILANTE architecture, the following requirements have been strictly implemented across the tech stack.

## 1. Functional Requirements

### FR-1: Authentication & Authorization
- **FR-1.1**: The system MUST authenticate users via Supabase SSR logic.
- **FR-1.2**: All data tables MUST be protected by Row Level Security (RLS) policies allowing access ONLY to verified UUID owners.
- **FR-1.3**: The Administrative Dashboard MUST restrict access based purely on `.env.local` level specific email definitions.

### FR-2: AI Tailoring Protocol
- **FR-2.1**: The engine MUST parse incoming `.pdf` and `.docx` blobs returning sterile text strings.
- **FR-2.2**: The core AI (Gemini 3.1 Pro) MUST strictly return parsed data as pure, validated JSON corresponding to internal ATS models.
- **FR-2.3**: The AI MUST adapt to language switches (English / Arabic RTL).

### FR-3: Rendering & Persistence
- **FR-3.1**: Returning JSON data MUST be seamlessly rebuilt into a high-performance PDF via `@react-pdf/renderer`.
- **FR-3.2**: Tailored assets MUST be streamed to Supabase Storage.
- **FR-3.3**: The History Dashboard MUST generate valid, Service-Role-signed un-expired URLs unconditionally.

### FR-4: Communication Protocol
- **FR-4.1**: If `email_notifications` is true, the system MUST trigger `nodemailer` upon success.
- **FR-4.2**: The dispatched email MUST contain a secure download asset link along with calculated ATS Score differentials.

---

## 2. Non-Functional Requirements

### NFR-1: Performance Metrics
- **NFR-1.1**: Next.js route handling for `/api/tailor` must be unblocked to accept 15+ second compilation delays natively required by heavy AI generations.
- **NFR-1.2**: Local processing components MUST heavily exploit the concurrent UI state of React 19 to maintain fluid animations.

### NFR-2: Aesthetic Quality
- **NFR-2.1**: The UI MUST consistently maintain a premium dark-mode identity (Glassmorphism, high-contrast, sharp typographic elements).
- **NFR-2.2**: Internationalization mapping LTR to RTL MUST occur smoothly utilizing localized flexbox utility classes.

### NFR-3: Security Posture
- **NFR-3.1**: Zero vulnerabilities across ESLint metrics.
- **NFR-3.2**: Standardized Http Headers preventing iframe and click-jacking behavior.
