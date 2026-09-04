import "server-only"

import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"

let transporter: nodemailer.Transporter | undefined

export function requireMailEnvironment(name: string) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required to send email.`)
  return value
}

function smtpConfig() {
  const port = Number(requireMailEnvironment("SMTP_PORT"))
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("SMTP_PORT must be a valid port number.")
  }

  const secureValue = requireMailEnvironment("SMTP_SECURE").toLowerCase()
  if (secureValue !== "true" && secureValue !== "false") {
    throw new Error("SMTP_SECURE must be true or false.")
  }

  return {
    host: requireMailEnvironment("SMTP_HOST"),
    port,
    secure: secureValue === "true",
    user: requireMailEnvironment("SMTP_USER"),
    password: requireMailEnvironment("SMTP_APP_PASSWORD"),
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

/**
 * Dipakai module Health Check untuk memverifikasi koneksi dan autentikasi SMTP
 * tanpa mengirim email. Transporter tetap memakai satu sumber canonical ini.
 */
export async function verifySmtpConnection() {
  const config = smtpConfig()
  await getTransporter().verify()
  return `${config.host}:${config.port}`
}

export function mailSender() {
  return {
    name: process.env.SMTP_FROM_NAME?.trim() || "Benah Palembang",
    address:
      process.env.SMTP_FROM_EMAIL?.trim() || requireMailEnvironment("SMTP_USER"),
  }
}

export function applicationUrl() {
  const url = new URL(requireMailEnvironment("APP_URL"))
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("APP_URL must use http or https.")
  }
  return url.toString().replace(/\/$/, "")
}

export function escapeHtml(value: string) {
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

export async function sendMail(input: {
  to: string
  subject: string
  text: string
  html: string
}) {
  await getTransporter().sendMail({
    from: mailSender(),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  })
}
