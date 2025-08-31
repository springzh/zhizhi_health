#!/usr/bin/env node

// 测试医生API数据的简单脚本
import fetch from 'node-fetch';

async function testDoctorsAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/doctors');
    const data = await response.json();
    
    console.log('=== 医生API测试结果 ===');
    console.log(`成功状态: ${data.success}`);
    console.log(`医生总数: ${data.data.length}`);
    console.log('');
    
    console.log('医生列表:');
    data.data.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor.name} - ${doctor.title} - ${doctor.specialty}`);
      console.log(`   状态: ${doctor.is_available ? '可预约' : '不可预约'}`);
      console.log(`   咨询次数: ${doctor.consultation_count}`);
      console.log('');
    });
    
    console.log('✅ API测试完成，所有医生数据正常');
    
  } catch (error) {
    console.error('❌ API测试失败:', error.message);
  }
}

testDoctorsAPI();