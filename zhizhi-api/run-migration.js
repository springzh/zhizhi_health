const { query, connectDatabase } = require('./dist/config/database.config');

async function runMigration() {
  try {
    console.log('🔄 Running migration...');
    
    // Initialize database connection
    await connectDatabase();
    
    // Add new columns
    await query(`
      ALTER TABLE doctors 
      ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS experience VARCHAR(100),
      ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '["中文"]',
      ADD COLUMN IF NOT EXISTS consultation_price DECIMAL(10,2) DEFAULT 100.00 CHECK (consultation_price >= 0)
    `);
    
    console.log('✅ New columns added successfully');
    
    // Update existing records
    await query(`
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
        consultation_price IS NULL
    `);
    
    console.log('✅ Existing records updated successfully');
    
    // Check the result
    const result = await query('SELECT COUNT(*) as count FROM doctors');
    console.log(`📊 Total doctors: ${result.rows[0].count}`);
    
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();