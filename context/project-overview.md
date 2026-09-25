# Surakshayantra

## Overview

Surakshayantra is a cybersecurity services company website with a secure client portal and an internal admin backend. It serves website owners and businesses that need professional security testing (VAPT, web application, mobile, API, and network security testing). The public marketing site builds trust and captures leads, the client portal lets authenticated clients submit and track security testing requests, and the admin backend lets internal staff manage users, requests, and CMS content — all behind three-role server-side access control (Client, Employee, Admin).

## Goals

1. Ship the Six-File Context System (`project-overview.md`, `architecture-context.md`, `code-standards.md`, `ai-workflow-rules.md`, `ui-context.md`, `progress-tracker.md`) before writing any production code.
2. Build and deploy a production-ready Phase 1 website using Next.js 16, React 19, Clerk, Prisma, and PostgreSQL.
3. Deliver a working public marketing site, secure client portal, and admin backend covering all Phase 1 in-scope features.
4. Enforce 3-role RBAC (`CLIENT`, `EMPLOYEE`, `ADMIN`) with server-side authorization on every mutation boundary.
5. Block disposable emails at signup and protect all portal and admin routes behind Clerk authentication.

## Core User Flow

1. Visitor lands on the homepage and browses services, methodology, blog, case studies, about, careers, and responsible disclosure pages.
2. Visitor clicks "Request Assessment" and is redirected to sign up or log in (Clerk — email/password, Google, or GitHub).
3. Disposable email check runs inside the Clerk sign-up flow (server-side, before account creation); rejected emails see an inline validation error. Exact implementation lives in the auth-related unit — do not invent additional interception points.
4. Authenticated Client lands on the dashboard and fills the single-page Request Security Testing form.
5. Submitted request appears as "Pending" in My Requests for the Client, and in the Admin/Employee request queue.
6. Admin or Employee reviews the request and moves its status through Pending → Reviewing → In Progress → Completed (or Cancelled).
7. Client tracks status on the dashboard and My Requests; communication happens over email.
8. Admin manages users, requests, and publishes Blog/Case Study content through the CMS.

## Features

### Public Marketing Site

- Homepage with hero (headline, subheadline, primary CTA, secondary CTA)
- Services page listing VAPT, Web App, Mobile App, API, and Network Security Testing
- Service Detail template with overview, scope, methodology, and deliverables
- Methodology page (static, structured explanation of testing process)
- Learning section: Blog and Case Studies (DB-backed, rendered from admin CMS)
- About, Careers (static), Responsible Disclosure (static + contact email)
- Contact page with contact form, support email, and optional phone display
- Privacy Policy, Terms of Service, PGP Key pages
- Branded 404 and 500 pages, uptime status dot in footer (decorative)
- Global header (logged-out and logged-in variants) and global footer

### Client Portal (Protected)

- Authentication Hub: sign in / sign up via Clerk (email+password, Google, GitHub) with disposable email blocking
- Client Dashboard: summary overview of active engagements and status
- My Requests: full list and detail view of the client's own requests
- Request Security Testing form (single page): Full Name, Company Name, Email, Phone (optional), Service Type (optional), Additional Details
- Profile Management: view and edit profile
- Support link in navbar: mailto to company support email

### Admin Backend (Internal)

- Admin Dashboard accessible to Admin and Employee roles
- User moderation: view and manage users
- Request management: view all requests, update status (Pending → Reviewing → In Progress → Completed / Cancelled)
- Contact form submissions queue
- CMS: rich text editor (TipTap) for Blog and Case Studies (create, edit, publish, manage); content JSON and images stored in Vercel Blob; PostgreSQL stores metadata only

### Access Control

- 3 roles in Phase 1: Client, Employee/Request Handler, Admin
- Clients see only their own requests and profile
- Employees see and handle all customer requests and update status
- Admins have full access to users, requests, and content
- Server-side authorization on every mutation boundary
- `returnTo` query parameter on 401 redirects. Accepted values are relative paths that start with `/` (e.g. `/portal/requests`). Reject absolute URLs, protocol-relative URLs, and any value that is not a same-origin relative path. Exact validation lives in the auth helpers — do not invent ad-hoc checks in individual routes.

### System States

- Loading: skeleton loaders for dashboard tables, branded spinners for form submissions
- Empty: "No active tests" graphic with CTA to start a first assessment
- Pending: "Review in Progress" badge on newly submitted requests
- Form error: inline red text with exact validation failures (e.g. "Please provide a valid corporate email. Webmail providers are not accepted.")
- System error: branded 404 and 500 pages with support contact
- Unauthorized: 401 redirect to login with `returnTo`

### Shared Form Fields

Contact form and Request Security Testing form both collect name and email. Use the same base Zod rules for these shared fields (name required, email required + valid format).

Additional rules by form:
- **Clerk sign-up only:** disposable-email blocking.
- **Request Security Testing form only:** corporate-email restriction — common webmail providers (Gmail, Yahoo, Outlook/Hotmail, etc.) are not accepted.
- **Contact form:** no disposable or webmail restriction beyond basic email format.

Do not invent additional shared schemas beyond name and email.

## Scope

### In Scope

- Public marketing pages: Homepage, Services, Service Detail, Methodology, About, Careers, Learning (Blog + Case Studies), Responsible Disclosure, Contact, Privacy Policy, Terms of Service, PGP Key
- Client portal: signup/login, disposable email blocking, dashboard, My Requests, Request Security Testing form, profile management
- Admin backend: dashboard, user management, request management and status updates, contact form submissions, Blog/Case Study CMS with TipTap rich text editor
- Vercel Blob storage for Blog/Case Study content JSON and CMS images
- 3-role RBAC (Client, Employee, Admin)
- Branded 404/500 pages, `returnTo` redirect, uptime status dot (static/decorative only)
- Responsive design, dark + light theme with toggle, global header and footer
- Deployment to production

### Out of Scope

- Automatic PDF security reports
- Online payment gateway
- Invoices and Contracts (removed from logged-in navbar)
- Custom SIEM integrations
- Advanced automated vulnerability scanning
- Mobile app
- AI-generated security reports
- Live Chat / Chatbot for technical support
- File uploads (NDA, network diagrams) in the request flow
- Team management
- "Download Sample Report" email gate and gated PDF assets
- MFA
- Trust Center and Live Compliance Dashboard
- Webinars
- Newsletter signup
- SLAs page or section
- In-app messaging / comments between client and admin (email only)
- Admin-managed job listings (Careers is static)
- Internal roles: Pentester, Marketing, Super Admin
- Client Admin / Client Viewer split
- Request assignment to a specific employee
- External status page integration (dot is decorative)
- Trigger.dev background tasks (Phase 2)
- Scheduled content publishing (Phase 2)

## Success Criteria

1. Six context files exist in `context/` and are read by the coding agent at the start of every session via `AGENTS.md`.
2. A visitor can browse all public pages and reach the Request Assessment CTA.
3. A visitor can sign up via Clerk (email/password, Google, or GitHub) and disposable emails are rejected with an inline error.
4. A signed-in Client can submit the Request Security Testing form and see the request as "Pending" in My Requests.
5. The same request is visible to Admin and Employee in the admin queue, and its status can be updated through all four stages plus Cancelled.
6. Admin can create, edit, and publish a Blog post and a Case Study via the CMS and see them rendered on the public Learning section.
7. A 401 redirect preserves the intended destination via the `returnTo` parameter.
8. `npm run build` passes and the app is deployed and reachable in production.