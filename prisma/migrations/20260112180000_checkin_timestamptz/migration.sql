-- Convert CheckIn timestamps to timestamptz so times are stored as UTC internally.
-- Existing data is assumed to have been written as UTC timestamps.

ALTER TABLE "CheckIn"
  ALTER COLUMN "checkinAt" TYPE TIMESTAMPTZ(3)
  USING ("checkinAt" AT TIME ZONE 'UTC');

ALTER TABLE "CheckIn"
  ALTER COLUMN "checkoutAt" TYPE TIMESTAMPTZ(3)
  USING (
    CASE
      WHEN "checkoutAt" IS NULL THEN NULL
      ELSE ("checkoutAt" AT TIME ZONE 'UTC')
    END
  );
