# Interactive Minds - Autism Care & Child Development Centre

A full-stack, production-grade web application built for **Interactive Minds** (Autism Care & Child Development Centre), replacing the Hostinger AI Website Builder site with a modern, responsive React/Next.js frontend, Node.js REST API layer, MySQL database, secure Admin Dashboard, appointment management, contact enquiry handling, and Hostinger deployment compatibility.

---

## Technical Stack

- **Frontend**: Next.js 14 (App Router with TypeScript), Tailwind CSS, Framer Motion, Lucide React Icons
- **Backend API**: Next.js App Router Route Handlers & REST API Architecture
- **Database**: MySQL 8.0 / MariaDB with `mysql2` connection pool & in-memory fallback
- **Authentication**: JWT tokens stored in HTTP-Only, Secure cookies + bcrypt password hashing
- **Validation**: Zod schema validation for all inputs and API payloads
- **Deployment Target**: Hostinger Node.js App Hosting with MySQL

---

## Information Architecture & Routes

### Public Routes
- `/` - Home Page (Hero, Philosophy, Therapies, Conditions, Pillars, Team, FAQs, CTA, Footer)
- `/about` - About Us Page (Mission, Pillars, Core Principles, Team)
- `/conditions` - Conditions Overview Grid
- `/conditions/[slug]` - Individual Condition Detail Pages (`autism-spectrum-disorder`, `adhd`, `dyslexia`, `down-syndrome`, `cerebral-palsy`)
- `/therapies` - Therapies Overview Grid
- `/therapies/[slug]` - Reusable Therapy Detail Pages (`aba-therapy`, `occupational-therapy`, `speech-therapy`, `special-education`, `sensory-integration`, `clinical-psychology`, `school-readiness`, `physiotherapy`, `parent-guidance`)
- `/media` - Media Gallery (Photos, Videos, Events with "Media coming soon" empty state)
- `/contact` - Contact Page (Verified Address, Phone, Email, Hours, Interactive Form)
- `/appointment` - Appointment Booking Request Page (Interactive Form with Reference ID generation)

### Admin Routes
- `/admin/login` - Secure Admin Gateway
- `/admin/dashboard` - Metrics Overview (Appointments, Messages, Active Services)
- `/admin/dashboard/appointments` - Appointments Table (Search, Filter, Detail View, Status Updates, Notes)
- `/admin/dashboard/messages` - Contact Enquiries Inbox (Search, Filter, Detail View, Status Updates)
- `/admin/dashboard/services` - Therapies & Services List
- `/admin/dashboard/conditions` - Conditions List
- `/admin/dashboard/team` - Multidisciplinary Team Roles
- `/admin/dashboard/faqs` - FAQs List
- `/admin/dashboard/testimonials` - Testimonials Manager
- `/admin/dashboard/media` - Media Gallery Manager
- `/admin/dashboard/settings` - Global Site Settings (Address, Phone, Email, WhatsApp, Tagline)

---

## Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Copy `.env.example` to `.env`:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=interactive_minds
   DB_USER=root
   DB_PASSWORD=

   JWT_SECRET=super_secret_jwt_key_change_in_production_2026
   SESSION_SECRET=super_secret_session_key_change_in_production_2026

   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ADMIN_EMAIL=admin@interactivemind.in
   ```

3. **Database Setup (MySQL)**:
   Import `database/schema.sql` and `database/seed.sql` into your local MySQL server:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p interactive_minds < database/seed.sql
   ```
   *(Note: If MySQL is not running locally, the application automatically runs using the in-memory fallback store with full functionality.)*

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Admin Login**:
   - URL: `http://localhost:3000/admin/login`
   - Default Email: `admin@interactivemind.in`
   - Default Password: `AdminSecurePass123!`

---

## Hostinger Deployment

Refer to [docs/deployment_guide.md](docs/deployment_guide.md) for detailed deployment steps on Hostinger.
