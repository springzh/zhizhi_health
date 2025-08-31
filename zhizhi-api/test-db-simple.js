const { Pool } = require('pg');

// 数据库配置
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'zhizhi_health',
  user: 'postgres',
  password: 'spring00',
  ssl: false,
});

async function testDatabaseConnection() {
  try {
    console.log('🔌 开始测试数据库连接...');
    
    // 测试基本连接
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ 数据库连接成功！当前时间:', result.rows[0].current_time);
    
    // 测试数据查询
    const doctorCount = await pool.query('SELECT COUNT(*) as count FROM doctors');
    console.log('👨‍⚕️ 医生数量:', doctorCount.rows[0].count);
    
    const serviceCount = await pool.query('SELECT COUNT(*) as count FROM services');
    console.log('🦷 服务数量:', serviceCount.rows[0].count);
    
    const membershipCount = await pool.query('SELECT COUNT(*) as count FROM membership_cards');
    console.log('💳 权益卡数量:', membershipCount.rows[0].count);
    
    // 查询示例数据
    const doctors = await pool.query('SELECT name, title, specialty, hospital FROM doctors LIMIT 3');
    console.log('📋 前3位医生信息:');
    doctors.rows.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor.name} - ${doctor.title} - ${doctor.specialty} - ${doctor.hospital}`);
    });
    
    console.log('🎉 数据库连接测试完成！所有功能正常。');
    
    await pool.end();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

testDatabaseConnection();