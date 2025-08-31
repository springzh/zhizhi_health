import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Membership() {
  const membershipCards = [
    {
      name: "基础版",
      price: "¥1,999",
      duration: "1年",
      description: "适合个人基础口腔护理需求",
      features: [
        "全面口腔检查 2次/年",
        "专业洗牙 2次/年", 
        "口腔拍片检查 1次/年",
        "在线咨询服务",
        "预约优先级 普通"
      ],
      popular: false,
      color: "from-gray-400 to-gray-600"
    },
    {
      name: "标准版",
      price: "¥3,999",
      duration: "1年",
      description: "适合经常需要口腔护理的用户",
      features: [
        "全面口腔检查 4次/年",
        "专业洗牙 4次/年",
        "口腔拍片检查 2次/年",
        "基础治疗 8折优惠",
        "美容治疗 9折优惠",
        "在线咨询服务",
        "预约优先级 较高",
        "专属客服通道"
      ],
      popular: true,
      color: "from-blue-500 to-blue-700"
    },
    {
      name: "尊享版",
      price: "¥8,999",
      duration: "1年",
      description: "追求高品质服务的最佳选择",
      features: [
        "全面口腔检查 不限次数",
        "专业洗牙 不限次数",
        "口腔拍片检查 不限次数",
        "基础治疗 7折优惠",
        "美容治疗 8折优惠",
        "种植牙治疗 9折优惠",
        "专属医生团队",
        "预约优先级 最高",
        "24小时专属客服",
        "免费上门服务",
        "年度体检套餐"
      ],
      popular: false,
      color: "from-purple-500 to-purple-700"
    },
    {
      name: "家庭版",
      price: "¥12,999",
      duration: "1年",
      description: "适合2-4人家庭共享",
      features: [
        "家庭全面口腔检查 不限次数",
        "家庭专业洗牙 不限次数",
        "家庭口腔拍片检查 不限次数",
        "基础治疗 7.5折优惠",
        "美容治疗 8.5折优惠",
        "儿童牙科专项服务",
        "家庭医生顾问",
        "预约优先级 高",
        "家庭健康档案",
        "定期家庭回访"
      ],
      popular: false,
      color: "from-green-500 to-green-700"
    }
  ]

  const benefits = [
    {
      icon: "⚡",
      title: "优先预约",
      description: "会员享受优先预约权，减少等待时间"
    },
    {
      icon: "💰", 
      title: "专属折扣",
      description: "各类治疗服务享受会员专属优惠价格"
    },
    {
      icon: "👨‍⚕️",
      title: "专属医生",
      description: "高等级会员配备专属医生团队"
    },
    {
      icon: "🏠",
      title: "上门服务",
      description: "尊享会员享受免费上门咨询服务"
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                医疗权益卡
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
                专属会员权益，享受优先预约、专属折扣和个性化健康管理服务
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                  立即购买
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                  了解详情
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Cards */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                选择适合您的会员卡
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                不同等级的会员卡，满足您不同的口腔健康需求
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {membershipCards.map((card, index) => (
                <div key={index} className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${card.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
                  {card.popular && (
                    <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                      最受欢迎
                    </div>
                  )}
                  <div className={`bg-gradient-to-r ${card.color} text-white p-6 text-center`}>
                    <h3 className="text-2xl font-bold mb-2">{card.name}</h3>
                    <div className="text-3xl font-bold mb-1">{card.price}</div>
                    <div className="text-sm opacity-90">{card.duration}</div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-center mb-6">
                      {card.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {card.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${card.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                      选择此卡
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                会员专属权益
              </h2>
              <p className="text-lg text-gray-600">
                成为会员，享受更多专属服务和特权
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
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
                购买流程
              </h2>
              <p className="text-lg text-gray-600">
                简单几步，即可享受会员权益
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "选择会员卡", description: "根据需求选择适合的会员卡类型" },
                { step: "02", title: "填写信息", description: "完善个人信息和联系方式" },
                { step: "03", title: "完成支付", description: "选择支付方式完成购买" },
                { step: "04", title: "激活使用", description: "会员卡即时生效，开始使用权益" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
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

        {/* CTA Section */}
        <section className="py-20 bg-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              开启您的专属健康之旅
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              立即购买会员卡，享受专业口腔健康服务
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                立即购买
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
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