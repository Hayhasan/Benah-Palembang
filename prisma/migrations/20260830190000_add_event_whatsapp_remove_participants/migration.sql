-- Add the required WhatsApp CTA and backfill existing events with the
-- reference contact before enforcing the non-null constraint.
ALTER TABLE "events" ADD COLUMN "whatsappUrl" TEXT;

UPDATE "events"
SET "whatsappUrl" = 'https://wa.me/628551241878'
WHERE "whatsappUrl" IS NULL;

ALTER TABLE "events" ALTER COLUMN "whatsappUrl" SET NOT NULL;

-- Participant click tracking is no longer part of the Event domain.
DROP TABLE "event_participants";
