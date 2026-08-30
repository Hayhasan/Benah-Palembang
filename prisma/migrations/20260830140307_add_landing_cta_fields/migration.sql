-- AlterTable
ALTER TABLE "website_contents" ADD COLUMN     "ctaBackgroundImageUrl" TEXT NOT NULL DEFAULT 'https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
ADD COLUMN     "ctaContactEmail" VARCHAR(320) NOT NULL DEFAULT 'kolaborasi@benahpalembang.id',
ADD COLUMN     "ctaContactLabel" VARCHAR(100) NOT NULL DEFAULT 'Hubungi Kami';
