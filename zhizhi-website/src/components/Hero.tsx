export default function Hero() {
  return (
    <section className="hero-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            专业口腔健康服务
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            为您提供优质的口腔诊疗、医疗权益卡和细胞健康服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/appointment" className="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block text-center">
              立即预约
            </a>
            <a href="/services/dental" className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-block text-center">
              了解更多
            </a>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-blue-100">专业医生团队</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-2">10,000+</div>
            <div className="text-blue-100">成功服务案例</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-blue-100">客户满意度</div>
          </div>
        </div>
      </div>
    </section>
  )
}