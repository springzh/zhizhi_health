'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
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
  replies: Reply[]
  attachments: Attachment[]
}

interface Reply {
  id: number
  consultation_id: number
  reply_type: string
  content: string
  is_internal_note: boolean
  created_at: string
}

interface Attachment {
  id: number
  consultation_id: number
  file_name: string
  file_url: string
  file_type?: string
  file_size?: number
  uploaded_at: string
}

export default function ConsultationDetailPage() {
  const params = useParams()
  const consultationId = params.id
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const replyTypeLabels = {
    doctor: '医生',
    admin: '管理员',
    user: '用户'
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

  const getReplyTypeColor = (replyType: string) => {
    switch (replyType) {
      case 'doctor': return 'bg-blue-100 text-blue-800'
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'user': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`)
      const result = await response.json()

      if (result.success) {
        setConsultation(result.data)
      } else {
        setError(result.message || '获取咨询详情失败')
      }
    } catch (error) {
      console.error('获取咨询详情失败:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (consultationId) {
      fetchConsultation()
    }
  }, [consultationId])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
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

  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            {error || '咨询不存在'}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{consultation.title}</h1>
              <div className="flex space-x-2 mb-4">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(consultation.status)}`}>
                  {statusLabels[consultation.status as keyof typeof statusLabels]}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(consultation.priority)}`}>
                  {priorityLabels[consultation.priority as keyof typeof priorityLabels]}
                </span>
                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                  {categoryLabels[consultation.category as keyof typeof categoryLabels]}
                </span>
              </div>
            </div>
            <a
              href="/my-consultations"
              className="text-primary hover:text-primary-dark"
            >
              ← 返回我的咨询
            </a>
          </div>

          <div className="prose max-w-none mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">咨询内容</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{consultation.content}</p>
            </div>
          </div>

          {consultation.attachments && consultation.attachments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">附件</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {consultation.attachments.map((attachment) => (
                  <div key={attachment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{attachment.file_name}</h4>
                      <span className="text-xs text-gray-500">{formatFileSize(attachment.file_size || 0)}</span>
                    </div>
                    <a
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark text-sm"
                    >
                      下载附件
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              回复记录 ({consultation.replies.length})
            </h3>
            
            {consultation.replies.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">暂无回复</p>
              </div>
            ) : (
              <div className="space-y-4">
                {consultation.replies.map((reply) => (
                  <div key={reply.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getReplyTypeColor(reply.reply_type)}`}>
                          {replyTypeLabels[reply.reply_type as keyof typeof replyTypeLabels]}
                        </span>
                        {reply.is_internal_note && (
                          <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                            内部备注
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex space-x-4">
                <span>查看次数: {consultation.view_count}</span>
                <span>回复次数: {consultation.reply_count}</span>
                <span>创建时间: {new Date(consultation.created_at).toLocaleString()}</span>
              </div>
              {consultation.is_public && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  公开咨询
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}