-- Review actor and timestamp are recorded by the central activity log.
ALTER TABLE "events" DROP CONSTRAINT "events_reviewedById_fkey";

ALTER TABLE "events"
DROP COLUMN "reviewedAt",
DROP COLUMN "reviewedById";
