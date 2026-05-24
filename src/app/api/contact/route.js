import nodemailer from 'nodemailer'

// Escape HTML entities to prevent HTML injection in email body
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Strip CR/LF to prevent SMTP header injection
function sanitizeHeader(str) {
  return String(str).replace(/[\r\n]/g, ' ').trim()
}

export async function POST(request) {
  const { email, name, school, message } = await request.json()

  if (!email || !name || !school || !message) {
    return Response.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const safeName = sanitizeHeader(name)
  const safeSchool = sanitizeHeader(school)
  const safeMessage = escapeHtml(message)

  // Gmail App Password required — not your account password
  // Generate at: myaccount.google.com/apppasswords
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: `"${safeName} via codeXperts" <${process.env.CONTACT_EMAIL_USER}>`,
      to: 'codeXperts2024@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${safeName} (${safeSchool})`,
      text: `From: ${safeName} <${email}>\nSchool: ${safeSchool}\n\n${message}`,
      html: `
      <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>School:</strong> ${escapeHtml(school)}</p>
      <hr />
      <p>${safeMessage.replace(/\n/g, '<br />')}</p>
    `,
    })
  } catch {
    return Response.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
