export default function Services() {
  const services = [
    {
      title: "口腔服务",
      description: "专业的口腔检查、治疗、美容和修复服务，由资深牙科专家团队提供",
      icon: "🦷",
      features: ["全面检查", "专业治疗", "美容修复", "在线预约"]
    },
    {
      title: "医疗权益卡",
      description: "专属会员权益，享受优先预约、专属折扣和个性化健康管理服务",
      icon: "💳",
      features: ["优先预约", "专属折扣", "健康管理", "家庭共享"]
    },
    {
      title: "细胞服务",
      description: "先进的细胞存储和治疗服务，为您和家人的健康提供长期保障",
      icon: "🔬",
      features: ["细胞存储", "健康治疗", "专业咨询", "长期保障"]
    }
  ]

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            核心服务
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们提供全方位的健康医疗服务，满足您不同的健康需求
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="service-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-800">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a 
                href={index === 0 ? "/services/dental" : index === 1 ? "/membership" : "/services/cell"}
                className="block w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors text-center"
              >
                了解更多
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}