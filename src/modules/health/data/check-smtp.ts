import "server-only"

import { verifySmtpConnection } from "@/modules/auth/data/mailer"

export async function checkSmtp(): Promise<string> {
  return await verifySmtpConnection()
}
