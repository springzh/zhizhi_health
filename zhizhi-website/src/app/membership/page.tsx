'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'

interface MembershipCard {
  id: number
  name: string
  price: string
  duration_days: number
  description: string
  benefits: Record<string, string | number | boolean>
  is_available: boolean
}

export default function Membership() {
  const [membershipCards, setMembershipCards] = useState<MembershipCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembershipCards = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/memberships')
        const data = await response.json()
        if (data.success) {
          setMembershipCards(data.data)
        } else {
          setError('Failed to fetch membership cards')
        }
      } catch (err) {
        setError('Error fetching membership cards')
        console.error('Error fetching membership cards:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMembershipCards()
  }, [])

  const formatBenefits = (benefits: Record<string, string | number | boolean>): string[] => {
    const benefitMap: Record<string, string> = {
      oral_exam: '全面口腔检查',
      teeth_cleaning: '专业洗牙',
      x_ray: '口腔拍片检查',
      online_consultation: '在线咨询服务',
      priority_level: '预约优先级',
      basic_treatment_discount: '基础治疗优惠',
      cosmetic_treatment_discount: '美容治疗优惠',
      implant_discount: '种植牙优惠',
      exclusive_service: '专属服务',
      exclusive_doctor: '专属医生团队',
      support_24h: '24小时专属客服',
      home_service: '免费上门服务',
      annual_checkup: '年度体检套餐',
      family_doctor: '家庭医生顾问',
      family_members: '家庭成员',
      family_records: '家庭健康档案',
      regular_followup: '定期家庭回访',
      pediatric_dental: '儿童牙科专项服务'
    }

    return Object.entries(benefits).map(([key, value]) => {
      const label = benefitMap[key] || key
      if (typeof value === 'boolean' && value) {
        return label
      }
      if (typeof value === 'number') {
        if (key.includes('discount')) {
          return `${label} ${value * 10}折`
        }
        return `${label} ${value}次/年`
      }
      if (value === 'unlimited') {
        return `${label} 不限次数`
      }
      if (key === 'priority_level') {
        return `${label} ${value === 'highest' ? '最高' : value === 'high' ? '高' : '普通'}`
      }
      return `${label} ${value}`
    })
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
                <div key={card.id} className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${index === 1 ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
                  {index === 1 && (
                    <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                      最受欢迎
                    </div>
                  )}
                  <div className={`bg-gradient-to-r ${index === 0 ? 'from-gray-400 to-gray-600' : index === 1 ? 'from-blue-500 to-blue-700' : index === 2 ? 'from-purple-500 to-purple-700' : 'from-green-500 to-green-700'} text-white p-6 text-center`}>
                    <h3 className="text-2xl font-bold mb-2">{card.name}</h3>
                    <div className="text-3xl font-bold mb-1">¥{card.price}</div>
                    <div className="text-sm opacity-90">1年</div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-center mb-6">
                      {card.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {formatBenefits(card.benefits).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${index === 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
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