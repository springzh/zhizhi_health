'use client'

import { useState, useEffect } from 'react'
import Footer from '../../components/Footer'

interface FAQCategory {
  id: number
  name: string
  description?: string
}

interface FAQ {
  id: number
  category_id?: number
  question: string
  answer: string
  view_count: number
  is_popular: boolean
  sort_order: number
  category?: FAQCategory
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchFAQs()
    fetchCategories()
  }, [])

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/faq')
      const data = await response.json()
      if (data.success) {
        setFaqs(data.data.data || [])
      }
    } catch (error) {
      console.error('获取FAQ失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/faq/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category_id?.toString() === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    const categoryName = faq.category?.name || '其他'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  return (
    <div className="min-h-screen">
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">常见问题解答</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              查找您关心的问题答案，如有其他疑问请随时联系我们
            </p>
          </div>

          {/* 搜索框 */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="搜索问题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id.toString()
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ列表 */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">加载中...</p>
              </div>
            ) : filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">暂无相关问题</h3>
                <p className="mt-2 text-gray-600">请尝试其他搜索词或分类</p>
              </div>
            ) : (
              Object.entries(groupedFAQs).map(([categoryName, categoryFAQs]) => (
                <div key={categoryName} className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{categoryName}</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {categoryFAQs.map((faq) => (
                      <div key={faq.id} className="px-6 py-4">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full text-left flex items-center justify-between group"
                        >
                          <h4 className="text-base font-medium text-gray-900 group-hover:text-primary transition-colors pr-4">
                            {faq.question}
                          </h4>
                          <svg
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transform transition-transform ${
                              expandedId === faq.id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedId === faq.id && (
                          <div className="mt-3 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 联系我们 */}
          <div className="mt-12 bg-primary rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">还有其他问题？</h3>
            <p className="text-lg mb-6 opacity-90">
              如果您没有找到想要的答案，欢迎随时联系我们
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/consultation"
                className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
              >
                在线咨询
              </a>
              <a
                href="tel:400-123-4567"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors inline-block"
              >
                电话咨询: 400-123-4567
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}