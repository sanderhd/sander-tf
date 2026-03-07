-- Add a temporary default so existing rows can be migrated safely.
ALTER TABLE "User"
ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT 'reset-required';
