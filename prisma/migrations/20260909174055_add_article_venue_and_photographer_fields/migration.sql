-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "photographer" VARCHAR(160),
ADD COLUMN     "venueAddress" TEXT,
ADD COLUMN     "venueContact" VARCHAR(100),
ADD COLUMN     "venueFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "venueName" VARCHAR(255),
ADD COLUMN     "venueOpenDays" VARCHAR(100),
ADD COLUMN     "venueOpenHours" VARCHAR(100),
ADD COLUMN     "venuePriceLevel" INTEGER DEFAULT 1;
