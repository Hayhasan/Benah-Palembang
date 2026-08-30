-- Add the column as nullable so existing accounts can be backfilled safely.
ALTER TABLE "users" ADD COLUMN "username" VARCHAR(30);

-- Generate lowercase usernames from display names and resolve collisions with
-- a numeric suffix before the NOT NULL and unique constraints are installed.
DO $$
DECLARE
  account RECORD;
  base_username TEXT;
  candidate_username TEXT;
  suffix_number INTEGER;
  suffix_text TEXT;
BEGIN
  FOR account IN
    SELECT "id", "name"
    FROM "users"
    ORDER BY "createdAt", "id"
  LOOP
    base_username := regexp_replace(
      regexp_replace(lower(account."name"), '[^a-z0-9]+', '_', 'g'),
      '^_+|_+$',
      '',
      'g'
    );

    IF base_username = '' THEN
      base_username := 'user';
    END IF;

    candidate_username := left(base_username, 30);
    suffix_number := 2;

    WHILE EXISTS (
      SELECT 1 FROM "users" WHERE "username" = candidate_username
    ) LOOP
      suffix_text := '_' || suffix_number::TEXT;
      candidate_username := left(base_username, 30 - length(suffix_text)) || suffix_text;
      suffix_number := suffix_number + 1;
    END LOOP;

    UPDATE "users"
    SET "username" = candidate_username
    WHERE "id" = account."id";
  END LOOP;
END $$;

ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;

ALTER TABLE "users"
  ADD CONSTRAINT "users_username_format_check"
  CHECK (
    "username" = lower("username")
    AND "username" ~ '^[a-z0-9_]([a-z0-9._]{0,28}[a-z0-9_])?$'
    AND "username" !~ '\.\.'
  );

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
