/* global process */
import nodemailer from 'nodemailer'

const MAX_NAME = 80
const MAX_EMAIL = 120
const MAX_MESSAGE = 4000

function sanitize(value = '') {
  return String(value).replace(/[\r\n]+/g, ' ').trim()
}

function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const name = sanitize(body?.name).slice(0, MAX_NAME)
    const email = sanitize(body?.email).slice(0, MAX_EMAIL)
    const message = sanitize(body?.message).slice(0, MAX_MESSAGE)
    const company = sanitize(body?.company)

    if (company) {
      return res.status(200).json({ ok: true })
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    const gmailUser = process.env.GMAIL_USER || 'harisankars.mbcet@gmail.com'
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '')
    const toAddress = process.env.CONTACT_TO || 'harisankars.mbcet@gmail.com'

    if (!gmailAppPassword) {
      return res.status(500).json({ error: 'Email service is not configured yet.' })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    await transporter.verify()

    const subject = `New portfolio message from ${name}`
    const textBody = [
      'New message from portfolio contact form',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      message,
    ].join('\n')

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 12px">New portfolio message</h2>
        <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:16px 0 8px"><strong>Message:</strong></p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `

    await transporter.sendMail({
      from: `Portfolio Contact <${gmailUser}>`,
      to: toAddress,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact API error:', error)

    if (error?.code === 'EAUTH') {
      return res.status(500).json({ error: 'Gmail authentication failed. Check GMAIL_USER and GMAIL_APP_PASSWORD.' })
    }

    if (error?.code === 'ETIMEDOUT' || error?.code === 'ESOCKET') {
      return res.status(500).json({ error: 'Could not connect to Gmail SMTP. Try again in a moment.' })
    }

    return res.status(500).json({ error: 'Could not send your message. Please try again.', code: error?.code || 'UNKNOWN' })
  }
}
