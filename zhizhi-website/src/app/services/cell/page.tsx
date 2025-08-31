import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function CellServices() {
  const services = [
    {
      name: "干细胞存储",
      description: "为未来健康投资，存储珍贵生命资源",
      features: [
        "脐带血干细胞存储",
        "脂肪干细胞存储", 
        "牙髓干细胞存储",
        "外周血干细胞存储",
        "长期安全保存",
        "质量检测认证"
      ],
      icon: "🧬",
      color: "from-teal-500 to-teal-700"
    },
    {
      name: "免疫细胞存储",
      description: "守护免疫系统，为健康保驾护航",
      features: [
        "NK细胞存储",
        "T细胞存储",
        "CAR-T细胞制备",
        "细胞活性检测",
        "冻存技术保障",
        "快速复苏服务"
      ],
      icon: "🛡️",
      color: "from-indigo-500 to-indigo-700"
    },
    {
      name: "细胞治疗",
      description: "前沿细胞技术，针对性治疗多种疾病",
      features: [
        "抗衰老治疗",
        "免疫系统调节",
        "慢性病辅助治疗",
        "亚健康状态改善",
        "个性化治疗方案",
        "专业医疗团队"
      ],
      icon: "⚕️",
      color: "from-emerald-500 to-emerald-700"
    },
    {
      name: "健康管理",
      description: "基于细胞技术的全方位健康管理",
      features: [
        "健康评估检测",
        "个性化健康方案",
        "营养指导建议",
        "生活方式干预",
        "定期健康跟踪",
        "专家咨询服务"
      ],
      icon: "📊",
      color: "from-cyan-500 to-cyan-700"
    }
  ]

  const advantages = [
    {
      title: "专业技术团队",
      description: "拥有国内外顶尖的细胞生物学专家和医疗团队",
      icon: "👨‍🔬"
    },
    {
      title: "先进设备保障",
      description: "引进国际一流的细胞存储和处理设备",
      icon: "🔬"
    },
    {
      title: "严格质控体系",
      description: "符合国际标准的质量控制和安全管理",
      icon: "✅"
    },
    {
      title: "全程可追溯",
      description: "从采集到存储的完整流程记录和追溯系统",
      icon: "📋"
    }
  ]

  const process = [
    { step: "01", title: "咨询评估", description: "专业顾问提供详细咨询服务" },
    { step: "02", title: "样本采集", description: "在指定医疗机构进行样本采集" },
    { step: "03", title: "实验室处理", description: "专业实验室进行细胞分离和检测" },
    { step: "04", title: "长期存储", description: "在液氮罐中长期安全保存" },
    { step: "05", title: "健康管理", description: "提供持续的健康管理服务" }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                细胞健康服务
              </h1>
              <p className="text-xl md:text-2xl text-teal-100 mb-8 max-w-3xl mx-auto">
                运用前沿细胞技术，为您的健康提供长期保障，开创健康管理新纪元
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-teal-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                  咨询专家
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
                  了解更多
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                核心服务
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                提供全方位的细胞健康服务，满足不同层次的健康需求
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-r ${service.color} text-white p-6`}>
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">{service.icon}</div>
                      <h3 className="text-2xl font-bold">{service.name}</h3>
                    </div>
                    <p className="text-teal-100">
                      {service.description}
                    </p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="w-5 h-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="mt-6 w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                      详细咨询
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                我们的优势
              </h2>
              <p className="text-lg text-gray-600">
                专业、安全、可靠的细胞健康服务保障
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{advantage.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600">
                    {advantage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                服务流程
              </h2>
              <p className="text-lg text-gray-600">
                规范化的服务流程，确保每一个环节都专业可靠
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {process.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Science Background Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  科学技术支撑
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    细胞技术是21世纪医学领域的重要突破，为人类健康带来了革命性的变化。
                    我们的细胞健康服务基于最新的科研成果和临床实践，为客户提供科学、
                    安全、有效的健康管理解决方案。
                  </p>
                  <p>
                    采用国际领先的细胞分离、培养和存储技术，确保细胞的活性和安全性。
                    每一份样本都经过严格的质量检测，保证存储的细胞在需要时能够发挥最佳效果。
                  </p>
                  <p>
                    我们与多家知名医疗机构和科研院所合作，不断推动细胞技术的发展和应用，
                    为客户提供最前沿的健康服务。
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  研发实力
                </h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-teal-600">50+</div>
                    <div className="text-sm text-gray-600">科研专家</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-teal-600">1000+</div>
                    <div className="text-sm text-gray-600">成功案例</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-teal-600">15+</div>
                    <div className="text-sm text-gray-600">技术专利</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-teal-600">99.9%</div>
                    <div className="text-sm text-gray-600">安全系数</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              开启您的细胞健康之旅
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              专业团队为您服务，让细胞科技守护您的健康未来
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                咨询专家
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
                了解更多
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}