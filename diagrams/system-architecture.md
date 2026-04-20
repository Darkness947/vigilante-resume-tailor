# System Architecture

```mermaid
graph TD
    Client[Next.js Client Components]
    Client -->|React 19 Hooks| Server[Next.js Server Actions]
    
    Server -->|Parse Request| Local_API[/api/parse/]
    Server -->|Gemini AI| Local_API2[/api/tailor/]
    Server -->|React-PDF| Local_API3[/api/pdf/]
    
    Server -.->|SSR Auth Cookies| Supabase_Auth[Supabase Auth]
    Server -.->|Service Key Signing| Supabase_Storage[Supabase Storage bucket: resumes]
    Server -.->|Database Inserts| Supabase_DB[(PostgreSQL RLS Database)]
    
    Local_API -->|pdf-parse / mammoth| Parser[Memory Parser]
    Local_API2 -->|JSON Schema Prompt| Gemini[Google Gemini 3.1 Pro]
    Local_API3 -->|PDF Buffer Generate| PDFRenderer[@react-pdf/renderer]
```
