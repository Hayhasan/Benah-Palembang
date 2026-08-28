import "server-only"

import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"

let transporter: nodemailer.Transporter | undefined

function requireEnvironment(name: string) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required for password reset email.`)
  return value
}

function smtpConfig() {
  const port = Number(requireEnvironment("SMTP_PORT"))
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("SMTP_PORT must be a valid port number.")
  }

  const secureValue = requireEnvironment("SMTP_SECURE").toLowerCase()
  if (secureValue !== "true" && secureValue !== "false") {
    throw new Error("SMTP_SECURE must be true or false.")
  }

  return {
    host: requireEnvironment("SMTP_HOST"),
    port,
    secure: secureValue === "true",
    user: requireEnvironment("SMTP_USER"),
    password: requireEnvironment("SMTP_APP_PASSWORD"),
  }
}

function getTransporter() {
  if (transporter) return transporter

  const config = smtpConfig()
  const options: SMTPTransport.Options = {
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  }
  transporter = nodemailer.createTransport(options)

  return transporter
}

function applicationUrl() {
  const url = new URL(requireEnvironment("APP_URL"))
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("APP_URL must use http or https.")
  }
  return url.toString().replace(/\/$/, "")
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }
    return entities[character] ?? character
  })
}

export async function sendPasswordResetEmail(input: {
  email: string
  name: string
  token: string
}) {
  const fromEmail =
    process.env.SMTP_FROM_EMAIL?.trim() || requireEnvironment("SMTP_USER")
  const fromName =
    process.env.SMTP_FROM_NAME?.trim() || "Benah Palembang"
  const resetUrl = `${applicationUrl()}/lupa-password/${encodeURIComponent(input.token)}`
  const safeName = escapeHtml(input.name)
  const safeResetUrl = escapeHtml(resetUrl)

  await getTransporter().sendMail({
    from: { name: fromName, address: fromEmail },
    to: input.email,
    subject: "Reset password akun Benah Palembang",
    text: [
      `Halo ${input.name},`,
      "",
      "Kami menerima permintaan untuk mengatur ulang password akun Benah Palembang Anda.",
      `Buka tautan berikut dalam 10 menit: ${resetUrl}`,
      "",
      "Jika Anda tidak meminta reset password, abaikan email ini.",
    ].join("\n"),
    html: `
      <div style="background:#f4f1ea;padding:32px 16px;font-family:Arial,sans-serif;color:#252422">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ddd7ca;border-radius:16px;overflow:hidden">
          <div style="background:#252422;padding:24px 28px;color:#ffffff">
            <p style="margin:0;color:#d7a84b;font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase">Benah Palembang</p>
            <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25">Atur ulang password Anda</h1>
          </div>
          <div style="padding:28px">
            <p style="margin:0 0 16px">Halo ${safeName},</p>
            <p style="margin:0 0 20px;line-height:1.7;color:#5b5750">Kami menerima permintaan untuk mengatur ulang password akun Anda. Tautan ini hanya berlaku selama 10 menit dan hanya dapat digunakan satu kali.</p>
            <a href="${safeResetUrl}" style="display:inline-block;background:#b5222a;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 20px;border-radius:8px">Atur Ulang Password</a>
            <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#777168">Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tidak akan berubah.</p>
          </div>
        </div>
      </div>
    `,
  })
}
