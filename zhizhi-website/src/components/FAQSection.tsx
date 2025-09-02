'use client'

import { useState, useEffect } from 'react'

interface FAQ {
  id: number
  category_id?: number
  question: string
  answer: string
  view_count: number
  is_popular: boolean
  sort_order: number
  category?: {
    name: string
    description?: string
  }
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularFAQs()
  }, [])

  const fetchPopularFAQs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/faq/popular?limit=5')
      const data = await response.json()
      if (data.success) {
        setFaqs(data.data || [])
      }
    } catch (error) {
      console.error('获取热门FAQ失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">常见问题解答</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            查看用户最常咨询的问题，快速获取您需要的答案
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {loading ? (
            // 加载状态
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-200">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4 group-hover:text-primary transition-colors">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-primary flex-shrink-0 transform transition-transform mt-1 ${
                        expandedId === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {expandedId === faq.id && (
                    <div className="text-gray-600 text-sm leading-relaxed pt-2 border-t border-gray-100">
                      {faq.answer}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    {faq.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {faq.category.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      点击{expandedId === faq.id ? '收起' : '展开'}
                    </span>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <a
            href="/faq"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            查看全部问题
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}