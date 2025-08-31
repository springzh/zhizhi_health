-- Migration: Add new fields to doctors table
-- Created: 2025-01-20
-- Description: Add education, experience, certifications, languages, and consultation_price fields to doctors table

-- Add new columns to doctors table
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS experience VARCHAR(100),
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '["中文"]',
ADD COLUMN IF NOT EXISTS consultation_price DECIMAL(10,2) DEFAULT 100.00 CHECK (consultation_price >= 0);

-- Update existing records with default values
UPDATE doctors 
SET 
  education = COALESCE(education, '[]'),
  experience = COALESCE(experience, '5年'),
  certifications = COALESCE(certifications, '[]'),
  languages = COALESCE(languages, '["中文"]'),
  consultation_price = COALESCE(consultation_price, 100.00)
WHERE 
  education IS NULL OR 
  experience IS NULL OR 
  certifications IS NULL OR 
  languages IS NULL OR 
  consultation_price IS NULL;

-- Create indexes for new fields if needed
CREATE INDEX IF NOT EXISTS idx_doctors_experience ON doctors(experience);
CREATE INDEX IF NOT EXISTS idx_doctors_consultation_price ON doctors(consultation_price);

-- Add comments
COMMENT ON COLUMN doctors.education IS '医生教育背景';
COMMENT ON COLUMN doctors.experience IS '从业经验描述';
COMMENT ON COLUMN doctors.certifications IS '专业认证';
COMMENT ON COLUMN doctors.languages IS '语言能力';
COMMENT ON COLUMN doctors.consultation_price IS '咨询价格';

-- Migration completed
SELECT 'Migration completed: Added new fields to doctors table' as status;