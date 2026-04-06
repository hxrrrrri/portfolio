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

If you run `npm run dev` (Vite only), `/api/contact` will return `404` because Vite does not execute serverless API functions.

## Scripts

- `npm run dev` - Vite frontend development server
- `npm run dev:vercel` - Full local runtime including `/api/*` functions
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Lint project
