import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Doctors() {
  const doctors = [
    {
      id: 1,
      name: "张建华",
      title: "主任医师",
      specialty: "口腔修复",
      hospital: "广州口腔医院",
      location: "广州",
      rating: 4.9,
      experience: "20年",
      education: "中山大学口腔医学院博士",
      avatar: "/api/placeholder/100/100",
      description: "专注于口腔修复领域20年，擅长种植牙、烤瓷牙等修复治疗，临床经验丰富。",
      services: ["种植牙", "烤瓷牙", "全口修复", "美学修复"],
      appointments: 1500
    },
    {
      id: 2,
      name: "李明珠",
      title: "副主任医师",
      specialty: "牙周治疗",
      hospital: "深圳人民医院",
      location: "深圳",
      rating: 4.8,
      experience: "15年",
      education: "华西口腔医学院硕士",
      avatar: "/api/placeholder/100/100",
      description: "牙周病治疗专家，在牙龈疾病治疗和口腔健康管理方面有深入研究。",
      services: ["牙周治疗", "牙龈刮治", "口腔保健", "激光治疗"],
      appointments: 1200
    },
    {
      id: 3,
      name: "王志强",
      title: "主治医师",
      specialty: "牙齿美容",
      hospital: "广州协和医院",
      location: "广州",
      rating: 4.7,
      experience: "12年",
      education: "第四军医大学口腔医学院",
      avatar: "/api/placeholder/100/100",
      description: "牙齿美容和矫正专家，致力于为患者创造完美笑容。",
      services: ["牙齿美白", "隐形矫正", "牙齿贴面", "美学设计"],
      appointments: 900
    },
    {
      id: 4,
      name: "陈小玲",
      title: "主任医师",
      specialty: "儿童牙科",
      hospital: "深圳儿童医院",
      location: "深圳",
      rating: 4.9,
      experience: "18年",
      education: "北京大学口腔医学院博士",
      avatar: "/api/placeholder/100/100",
      description: "儿童牙科专家，擅长儿童牙齿矫正和预防治疗，亲和力强。",
      services: ["儿童牙齿矫正", "窝沟封闭", "儿童补牙", "口腔预防"],
      appointments: 1100
    },
    {
      id: 5,
      name: "刘建国",
      title: "主任医师",
      specialty: "口腔外科",
      hospital: "广州中山医院",
      location: "广州",
      rating: 4.8,
      experience: "25年",
      education: "上海交通大学口腔医学院",
      avatar: "/api/placeholder/100/100",
      description: "口腔外科资深专家，复杂牙齿拔除和口腔手术经验丰富。",
      services: ["复杂拔牙", "口腔手术", "种植外科", "颌面外科"],
      appointments: 1800
    },
    {
      id: 6,
      name: "赵美丽",
      title: "副主任医师",
      specialty: "根管治疗",
      hospital: "深圳第二人民医院",
      location: "深圳",
      rating: 4.9,
      experience: "16年",
      education: "武汉大学口腔医学院硕士",
      avatar: "/api/placeholder/100/100",
      description: "根管治疗专家，显微根管治疗技术精湛，成功率高。",
      services: ["根管治疗", "显微根管", "牙髓治疗", "牙齿保存"],
      appointments: 1300
    },
    {
      id: 7,
      name: "孙大伟",
      title: "主治医师",
      specialty: "口腔正畸",
      hospital: "广州口腔医院",
      location: "广州",
      rating: 4.6,
      experience: "10年",
      education: "南京医科大学口腔医学院",
      avatar: "/api/placeholder/100/100",
      description: "正畸专科医生，各类错颌畸形矫正经验丰富。",
      services: ["传统矫正", "隐形矫正", "儿童矫正", "成人矫正"],
      appointments: 800
    },
    {
      id: 8,
      name: "周雅琴",
      title: "副主任医师",
      specialty: "口腔综合",
      hospital: "深圳北大医院",
      location: "深圳",
      rating: 4.8,
      experience: "14年",
      education: "中山大学口腔医学院硕士",
      avatar: "/api/placeholder/100/100",
      description: "综合口腔治疗专家，擅长常见口腔疾病的诊断和治疗。",
      services: ["综合治疗", "预防保健", "常见病治疗", "口腔检查"],
      appointments: 1000
    }
  ]

  const locations = ["全部", "广州", "深圳"]
  const specialties = ["全部", "口腔修复", "牙周治疗", "牙齿美容", "儿童牙科", "口腔外科", "根管治疗", "口腔正畸", "口腔综合"]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                专业医生团队
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                汇聚资深口腔医学专家，为您提供专业、安全、贴心的口腔健康服务
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                  立即预约
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  在线咨询
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索医生姓名、医院或专长..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-4">
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                推荐医生
              </h2>
              <p className="text-gray-600">为您精选优质口腔医生资源</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-2xl text-white">👨‍⚕️</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mb-1">{doctor.title}</p>
                      <p className="text-sm text-gray-600 mb-1">{doctor.specialty}</p>
                      <p className="text-xs text-gray-500 mb-3">{doctor.hospital} · {doctor.location}</p>
                      
                      <div className="flex items-center justify-center mb-3">
                        <div className="flex text-yellow-400 text-sm">
                          ★★★★★
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {doctor.rating}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        {doctor.experience}经验 · {doctor.appointments}+预约
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">擅长项目：</h4>
                      <div className="flex flex-wrap gap-1">
                        {doctor.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {service}
                          </span>
                        ))}
                        {doctor.services.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{doctor.services.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        预约咨询
                      </button>
                      <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">专业医生</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10万+</div>
                <div className="text-gray-600">成功案例</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">满意度</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15年</div>
                <div className="text-gray-600">平均经验</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              找到适合您的医生
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              专业团队为您提供个性化的口腔健康解决方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                立即预约
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                咨询客服
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}