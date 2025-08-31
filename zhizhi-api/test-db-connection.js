import { query } from './src/config/database.config';
import { logger } from './src/utils/logger';

async function testDatabaseConnection() {
  try {
    logger.info('开始测试数据库连接...');
    
    // 测试基本连接
    const result = await query('SELECT NOW() as current_time');
    logger.info('✅ 数据库连接成功！当前时间:', result.rows[0].current_time);
    
    // 测试数据查询
    const doctorCount = await query('SELECT COUNT(*) as count FROM doctors');
    logger.info('👨‍⚕️ 医生数量:', doctorCount.rows[0].count);
    
    const serviceCount = await query('SELECT COUNT(*) as count FROM services');
    logger.info('🦷 服务数量:', serviceCount.rows[0].count);
    
    const membershipCount = await query('SELECT COUNT(*) as count FROM membership_cards');
    logger.info('💳 权益卡数量:', membershipCount.rows[0].count);
    
    // 查询示例数据
    const doctors = await query('SELECT name, title, specialty, hospital FROM doctors LIMIT 3');
    logger.info('📋 前3位医生信息:');
    doctors.rows.forEach((doctor, index) => {
      logger.info(`${index + 1}. ${doctor.name} - ${doctor.title} - ${doctor.specialty} - ${doctor.hospital}`);
    });
    
    logger.info('🎉 数据库连接测试完成！所有功能正常。');
    
    process.exit(0);
  } catch (error) {
    logger.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
}

testDatabaseConnection();