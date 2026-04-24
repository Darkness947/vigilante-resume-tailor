# 🏛️ VIGILANTE: Engineering Master Record

## 1. Executive Summary
The **VIGILANTE Resume Tailor** is a high-performance, enterprise-grade AI orchestration platform. It unifies the Next.js 16 (Canary) runtime with Google's Gemini to solve the "Black Hole" ATS problem. By automating the alignment between candidate data and job requirements, Vigilante provides a measurable competitive edge in the modern job market.

---

## 2. Technical Architecture

### 2.1 The Modern Stack
| Component | Implementation | Rationale |
| :--- | :--- | :--- |
| **Runtime** | Next.js 16.2 | Optimal Server Actions & App Router stability. |
| **Logic** | TypeScript (Strict) | Eliminate type-related runtime failures. |
| **Styling** | Tailwind CSS v4 | High-performance, zero-runtime CSS. |
| **Database** | Supabase (PostgreSQL) | Native RLS and enterprise-scale persistence. |
| **AI** | Google Gemini | Superior reasoning for professional re-writing. |

### 2.2 Security Model
- **Identity**: Supabase Auth handles JWT issuance and session management.
- **Data Protection**: PostgreSQL Row Level Security (RLS) ensures that `SELECT/UPDATE/INSERT` operations are scoped strictly to `auth.uid()`.
- **API Defense**: Upstash Ratelimiting prevents automated drain of Gemini API tokens.

---

## 3. Operations & Maintenance

### 3.1 Environment Configuration (`.env.local`)
VIGILANTE requires the following secure keys for operation:
- `NEXT_PUBLIC_SUPABASE_URL`: API gateway for Supabase.
- `GEMINI_API_KEY`: Orchestration key for AI generations.
- `SUPABASE_SERVICE_ROLE_KEY`: Required for administrative storage signing.
- `RESEND_API_KEY`: Pipeline for transactional email delivery.

### 3.2 Deployment Strategy (Vercel)
VIGILANTE is optimized for Vercel's serverless environment:
1. **Edge Middleware**: Handles internationalization (i18n) and locale redirects.
2. **Serverless Functions**: Executes heavy AI tailoring logic (configured for 60s timeout).
3. **ISR/SSG**: Landing pages are statically generated for sub-100ms LCP.

---

## 4. Future Roadmap

- [ ] **Phase 7**: Integration with LinkedIn API for 1-click profile induction.
- [ ] **Phase 8**: Multi-template selection (Academic, Creative, Executive).
- [ ] **Phase 9**: AI Interview Coach based on the tailored resume.

---

## 5. Maintenance Guide

### Updating Dependencies
Run `npm run lint` before any commit. VIGILANTE enforces a zero-warning policy to prevent memory leaks and technical debt.

### Database Migrations
All schema changes must be documented in `/supabase/migrations`. Never modify the production schema directly via the Supabase UI.

---

## 6. Conclusion
VIGILANTE represents the pinnacle of modern web engineering. From parsing unstable binary files to blasting targeted ATS metrics back into encrypted cloud storage, every node on the system network behaves with surgical precision.

> **Status: MISSION COMPLETE (v0.1.0)**
