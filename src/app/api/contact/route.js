import nodemailer from 'nodemailer'

export async function POST(request) {
  const { email, name, school, message } = await request.json()

  if (!email || !name || !school || !message) {
    return Response.json({ error: 'All fields are required.' }, { status: 400 })
  }

  // Gmail App Password required — not your account password
  // Generate at: myaccount.google.com/apppasswords
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"codeXperts Contact" <${process.env.CONTACT_EMAIL_USER}>`,
    to: 'codeXperts2024@gmail.com',
    replyTo: email,
    subject: `Contact Form: ${name} (${school})`,
    text: `From: ${name} <${email}>\nSchool: ${school}\n\n${message}`,
    html: `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>School:</strong> ${school}</p>
      <hr />
      <p>${message.replace(/\n/g, '<br />')}</p>
    `,
  })

  return Response.json({ ok: true })
}
