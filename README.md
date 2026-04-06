# Portfolio Website

This portfolio is built with React + Vite and includes a contact form that sends messages directly to your Gmail using a Vercel serverless API.

## Contact Form Setup (Gmail)

The backend mail route is in `api/contact.js`.

### 1. Create a Gmail App Password

1. Go to your Google Account.
2. Enable 2-Step Verification if it is not enabled.
3. Open App Passwords.
4. Create a new app password for Mail.
5. Copy the 16-character password.

### 2. Configure Environment Variables

Use `.env.example` as reference.

Required variables:

- `GMAIL_USER=harisankars.mbcet@gmail.com`
- `GMAIL_APP_PASSWORD=<your_16_char_password>`
- `CONTACT_TO=harisankars.mbcet@gmail.com`

Also supported aliases:

- `SMTP_USER` (same as `GMAIL_USER`)
- `GMAIL_PASS` or `SMTP_PASS` (same as `GMAIL_APP_PASSWORD`)

For Vercel deployment, add the same variables in Project Settings -> Environment Variables.

### 3. Run Locally

Install dependencies:

```bash
npm install
```

To test the contact API locally, run with Vercel dev server (not plain Vite):

```bash
npm run dev:vercel
```

Open the local URL shown by Vercel and test the Contact page.

Use this URL for `dev:vercel`:

- `http://127.0.0.1:3000`

Do not open `http://localhost:5173` while testing contact API via Vercel runtime.

If you run `npm run dev` (Vite only), `/api/contact` will return `404` because Vite does not execute serverless API functions.

## Scripts

- `npm run dev` - Vite frontend development server
- `npm run dev:vercel` - Full local runtime including `/api/*` functions
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Lint project

## Vite WebSocket Error Fix

If you see `[vite] failed to connect to websocket`:

1. Stop all running dev servers.
2. Start only one command based on your goal:
	- `npm run dev` for frontend-only work
	- `npm run dev:vercel` for contact API testing
3. For frontend-only dev, open `http://127.0.0.1:5173`.
4. For API testing, open `http://127.0.0.1:3000`.

Running both servers and switching URLs can cause HMR websocket errors in the browser.
