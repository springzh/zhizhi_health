'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'

interface Consultation {
  id: number
  title: string
  content: string
  category: string
  status: string
  priority: string
  is_public: boolean
  view_count: number
  reply_count: number
  created_at: string
  updated_at: string
}

export default function MyConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categoryLabels = {
    general: '一般咨询',
    dental: '口腔咨询',
    cell: '细胞咨询',
    membership: '权益卡咨询',
    appointment: '预约咨询'
  }

  const statusLabels = {
    pending: '待回复',
    replied: '已回复',
    closed: '已关闭',
    cancelled: '已取消'
  }

  const priorityLabels = {
    low: '低',
    normal: '普通',
    high: '高',
    urgent: '紧急'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const fetchConsultations = async () => {
    try {
      const response = await fetch(`/api/consultations/my-consultations?page=${page}&limit=10`)
      const result = await response.json()

      if (result.success) {
        setConsultations(result.data.consultations)
        setTotalPages(result.data.totalPages)
      } else {
        setError(result.message || '获取咨询历史失败')
      }
    } catch (error) {
      console.error('获取咨询历史失败:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConsultations()
  }, [page])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
                <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
            
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">我的咨询</h1>
            <a
              href="/consultation"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              新建咨询
            </a>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {consultations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无咨询记录</h3>
              <p className="text-gray-600 mb-6">您还没有提交过任何咨询</p>
              <a
                href="/consultation"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors inline-block"
              >
                立即咨询
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{consultation.title}</h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(consultation.status)}`}>
                        {statusLabels[consultation.status as keyof typeof statusLabels]}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(consultation.priority)}`}>
                        {priorityLabels[consultation.priority as keyof typeof priorityLabels]}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{consultation.content}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <span>类别: {categoryLabels[consultation.category as keyof typeof categoryLabels]}</span>
                      <span>回复: {consultation.reply_count}</span>
                      <span>查看: {consultation.view_count}</span>
                    </div>
                    <div className="flex space-x-4">
                      <span>创建时间: {new Date(consultation.created_at).toLocaleDateString()}</span>
                      <a
                        href={`/consultation/${consultation.id}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        查看详情 →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 border rounded-md ${
                        page === pageNum
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}