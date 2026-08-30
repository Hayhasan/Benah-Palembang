DELETE FROM "website_article_section_pins"
WHERE "position" > 3;

ALTER TABLE "website_article_section_pins"
DROP CONSTRAINT "website_article_section_pins_position_check";

ALTER TABLE "website_article_section_pins"
ADD CONSTRAINT "website_article_section_pins_position_check"
CHECK ("position" BETWEEN 1 AND 3);
