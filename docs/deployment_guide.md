# Hostinger Deployment Guide for Interactive Minds

This document outlines the step-by-step procedure to deploy the rebuilt **Interactive Minds** full-stack application onto Hostinger Node.js & MySQL hosting.

---

## 1. Prerequisites on Hostinger

1. **Hostinger Hosting Plan**: Business Web Hosting, Cloud Hosting, or VPS with Node.js support enabled.
2. **Node.js Version**: Node.js v18+ or v20+ enabled via Hostinger Web Application / Setup Node.js App manager.
3. **MySQL Database**: A MySQL 8.0 / MariaDB database created in Hostinger hPanel.

---

## 2. Database Creation & Migration

1. Log in to Hostinger hPanel and navigate to **Databases** -> **MySQL Databases**.
2. Create a new database:
   - Database Name: `u123456789_interactive_minds`
   - Username: `u123456789_interactive_user`
   - Password: `[YOUR_SECURE_PASSWORD]`
3. Open **phpMyAdmin** for the newly created database.
4. Go to the **Import** tab.
5. Import `database/schema.sql`.
6. Import `database/seed.sql` to populate initial services, conditions, FAQs, site settings, and the default admin account.

---

## 3. Application Build & Environment Setup

1. On your local machine, run the production build:
   ```bash
   npm run build
   ```
2. Prepare the deployment package containing:
   - `.next/standalone` directory
   - `.next/static` (copy to `.next/standalone/.next/static`)
   - `public` (copy to `.next/standalone/public`)
   - `package.json`
   - `.env`

3. Create the `.env` file for production:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=u123456789_interactive_minds
   DB_USER=u123456789_interactive_user
   DB_PASSWORD=[YOUR_SECURE_PASSWORD]

   JWT_SECRET=[YOUR_RANDOM_LONG_SECRET_KEY]
   SESSION_SECRET=[YOUR_RANDOM_LONG_SECRET_KEY]

   NEXT_PUBLIC_SITE_URL=https://www.interactivemind.in
   ADMIN_EMAIL=interactiveminds@gmail.com
   NODE_ENV=production
   ```

---

## 4. Hostinger Node.js App Configuration

1. In hPanel, go to **Setup Node.js App**.
2. Create Application:
   - Node.js version: **v20.x** (or latest v18/v20 available)
   - Application mode: **Production**
   - Application root: `/public_html` (or subfolder if staging)
   - Application URL: `https://www.interactivemind.in`
   - Application startup file: `server.js` (from `.next/standalone/server.js`)
3. Upload files via FTP/File Manager to the application root directory.
4. Click **Run npm install** in hPanel if needed (or include node_modules from standalone output).
5. Start / Restart the Node.js application.

---

## 5. Verification & Switchover Checklist

Before switching DNS / replacing live builder site:

- [ ] Test Homepage (`/`) and check all navigation links.
- [ ] Test all 9 therapy pages (`/therapies/[slug]`).
- [ ] Test all 5 condition pages (`/conditions/[slug]`).
- [ ] Submit a test Appointment request on `/appointment` and verify reference code generation.
- [ ] Submit a test Contact enquiry on `/contact`.
- [ ] Log in to Admin Dashboard at `/admin/login` using credentials (`admin@interactivemind.in`).
- [ ] Verify that the test appointment request appears in `/admin/dashboard/appointments` and update its status.
- [ ] Verify HTTPS/SSL certificate active on Hostinger.
