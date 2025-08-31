'use client'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useEffect, useState } from 'react'

interface Service {
  id: number
  category_id: number
  name: string
  description: string
  price: string
  duration: number
  images: string[]
  content: string
  is_recommended: boolean
}

interface ServiceCategory {
  name: string
  description: string
  services: Service[]
}

export default function DentalServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/services')
        const data = await response.json()
        if (data.success) {
          // Filter only dental services (categories 1-9)
          const dentalServices = data.data.filter((service: Service) => service.category_id >= 1 && service.category_id <= 9)
          setServices(dentalServices)
        } else {
          setError('Failed to fetch services')
        }
      } catch (err) {
        setError('Error fetching services')
        console.error('Error fetching services:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const formatDuration = (duration: number): string => {
    if (duration === 0) return '预约咨询'
    if (duration < 60) return `${duration}分钟`
    if (duration < 1440) return `${Math.floor(duration / 60)}小时`
    return `${Math.floor(duration / 1440)}天`
  }

  const groupServicesByCategory = (services: Service[]): ServiceCategory[] => {
    const categoryMap: Record<number, ServiceCategory> = {
      1: { name: "口腔检查类", description: "全面的口腔健康检查服务", services: [] },
      2: { name: "治疗类服务", description: "专业的口腔疾病治疗", services: [] },
      3: { name: "牙周治疗", description: "专业牙周疾病治疗和护理", services: [] },
      4: { name: "美容类服务", description: "提升笑容美观度", services: [] },
      5: { name: "修复类服务", description: "恢复牙齿功能和美观", services: [] },
      6: { name: "根管治疗", description: "专业根管治疗，保存患牙", services: [] },
      7: { name: "口腔外科", description: "口腔外科手术治疗", services: [] },
      8: { name: "正畸服务", description: "牙齿矫正和排列", services: [] },
      9: { name: "儿童牙科", description: "儿童专属口腔服务", services: [] }
    }

    services.forEach(service => {
      if (categoryMap[service.category_id]) {
        categoryMap[service.category_id].services.push(service)
      }
    })

    return Object.values(categoryMap).filter(category => category.services.length > 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl">加载中...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-red-600">错误: {error}</div>
        </div>
        <Footer />
      </div>
    )
  }

  const categories = groupServicesByCategory(services)

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                专业口腔服务
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                提供全方位的口腔健康服务，从预防检查到复杂治疗，由资深牙科专家团队为您提供专业护理
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/appointment" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block text-center">
                  立即预约
                </a>
                <a href="/consultation?category=dental" className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block text-center">
                  咨询专家
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                服务分类
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                我们提供全面的口腔医疗服务，满足您不同的健康需求
              </p>
            </div>

            <div className="space-y-12">
              {categories.map((category, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.services.map((service) => (
                      <div key={service.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {service.name}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="text-blue-600 font-medium">¥{service.price}</p>
                          <p>时长: {formatDuration(service.duration)}</p>
                        </div>
                        <a href="/appointment" className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-block text-center">
                          预约服务
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                服务流程
              </h2>
              <p className="text-lg text-gray-600">
                专业的服务流程，确保您获得最佳的诊疗体验
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "预约挂号", description: "在线预约选择合适的医生和时间" },
                { step: "02", title: "初诊检查", description: "全面口腔检查，制定治疗方案" },
                { step: "03", title: "专业治疗", description: "资深医生提供专业治疗服务" },
                { step: "04", title: "术后跟踪", description: "定期复查，确保治疗效果" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
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
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              开始您的口腔健康之旅
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              专业团队为您服务，让健康笑容从这里开始
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/appointment" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block text-center">
                立即预约
              </a>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
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