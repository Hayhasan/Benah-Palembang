import "server-only"

import { verifySmtpConnection } from "@/lib/mail/mailer"

export async function checkSmtp(): Promise<string> {
  return await verifySmtpConnection()
}
