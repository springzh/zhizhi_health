'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'

interface RightsCard {
  id: number
  name: string
  type: 'nursing' | 'special_drug' | 'other'
  description?: string
  price: number
  duration_years: number
  activation_age_min: number
  activation_age_max: number
  key_features: string[]
  benefits: string[]
  target_audience: string[]
  is_available: boolean
}

export default function RightsCards() {
  const [rightsCards, setRightsCards] = useState<RightsCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCard, setSelectedCard] = useState<RightsCard | null>(null)

  useEffect(() => {
    const fetchRightsCards = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/rights-cards/cards/available')
        const data = await response.json()
        if (data.success) {
          setRightsCards(data.data)
        } else {
          setError('Failed to fetch rights cards')
        }
      } catch (err) {
        setError('Error fetching rights cards')
        console.error('Error fetching rights cards:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRightsCards()
  }, [])

  const filteredCards = selectedType === 'all' 
    ? rightsCards 
    : rightsCards.filter(card => card.type === selectedType)

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case 'nursing': return '护工卡'
      case 'special_drug': return '特药卡'
      default: return '其他'
    }
  }

  const getCardTypeColor = (type: string, index: number) => {
    if (type === 'nursing') {
      return index === 0 ? 'from-blue-400 to-blue-600' : 'from-blue-500 to-blue-700'
    } else if (type === 'special_drug') {
      return index === 0 ? 'from-green-400 to-green-600' : 'from-green-500 to-green-700'
    } else {
      return index === 0 ? 'from-purple-400 to-purple-600' : 'from-purple-500 to-purple-700'
    }
  }

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'nursing': return '👩‍⚕️'
      case 'special_drug': return '💊'
      default: return '🎯'
    }
  }

  const features = [
    {
      icon: "🛡️",
      title: "全面保障",
      description: "覆盖医疗、护理、药品等多方面健康需求"
    },
    {
      icon: "💰", 
      title: "超值优惠",
      description: "相比市场价格，享受更优惠的服务价格"
    },
    {
      icon: "⚡",
      title: "快速响应",
      description: "48小时内响应服务申请，及时解决需求"
    },
    {
      icon: "🎯",
      title: "专属服务",
      description: "一对一专业服务，个性化定制方案"
    }
  ]

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

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                健康权益卡
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                专业护工服务、特药保障，为您和家人的健康保驾护航
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                  立即购买
                </button>
                <a href="/consultation?category=membership" className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors inline-block text-center">
                  咨询客服
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedType === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedType('nursing')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedType === 'nursing' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👩‍⚕️ 护工卡
              </button>
              <button
                onClick={() => setSelectedType('special_drug')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedType === 'special_drug' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                💊 特药卡
              </button>
            </div>
          </div>
        </section>

        {/* Rights Cards */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                选择适合您的权益卡
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                多种权益卡产品，满足您不同的健康保障需求
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCards.map((card, index) => (
                <div 
                  key={card.id} 
                  className={`relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${
                    index === 1 ? 'ring-2 ring-blue-500 transform scale-105' : ''
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  {index === 1 && (
                    <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                      最受欢迎
                    </div>
                  )}
                  <div className={`bg-gradient-to-r ${getCardTypeColor(card.type, index)} text-white p-6 text-center`}>
                    <div className="text-4xl mb-2">{getCardIcon(card.type)}</div>
                    <h3 className="text-2xl font-bold mb-2">{card.name}</h3>
                    <div className="text-3xl font-bold mb-1">¥{card.price}</div>
                    <div className="text-sm opacity-90">{card.duration_years}年</div>
                    <div className="text-xs opacity-75 mt-1">
                      {card.activation_age_min}-{card.activation_age_max}周岁可激活
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-center mb-6 text-sm">
                      {card.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {card.key_features.slice(0, 4).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                      {card.key_features.length > 4 && (
                        <li className="text-sm text-gray-500 ml-6">
                          +{card.key_features.length - 4} 项更多权益
                        </li>
                      )}
                    </ul>
                    <div className="text-center">
                      <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        index === 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}>
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                权益卡核心优势
              </h2>
              <p className="text-lg text-gray-600">
                专业保障，让健康更安心
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
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
                简单几步，即可享受权益保障
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "选择权益卡", description: "根据需求选择适合的权益卡类型" },
                { step: "02", title: "填写信息", description: "完善个人信息和联系方式" },
                { step: "03", title: "完成支付", description: "选择支付方式完成购买" },
                { step: "04", title: "激活使用", description: "权益卡即时生效，开始使用保障" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
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
        <section className="py-20 bg-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              开启您的健康保障之旅
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              立即购买权益卡，享受专业健康保障服务
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                立即购买
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                咨询客服
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedCard.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCard.type === 'nursing' ? 'bg-blue-100 text-blue-800' : 
                    selectedCard.type === 'special_drug' ? 'bg-green-100 text-green-800' : 
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {getCardTypeLabel(selectedCard.type)}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">¥{selectedCard.price}</div>
                <div className="text-gray-600">
                  {selectedCard.duration_years}年有效期 · {selectedCard.activation_age_min}-{selectedCard.activation_age_max}周岁可激活
                </div>
              </div>

              {selectedCard.description && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">产品介绍</h4>
                  <p className="text-gray-600">{selectedCard.description}</p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">核心权益</h4>
                <ul className="space-y-2">
                  {selectedCard.key_features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">适用人群</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.target_audience.map((audience, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  立即购买
                </button>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}