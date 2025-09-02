'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import AuthModal from '@/components/AuthModal'
import Footer from '@/components/Footer'

export default function ConsultationPage() {
  const searchParams = useSearchParams()
  const { isAuthenticated, user } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    doctor_id: '',
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    is_public: false
  })

  useEffect(() => {
    const doctorId = searchParams.get('doctor_id')
    const category = searchParams.get('category')
    
    if (doctorId) {
      setFormData(prev => ({
        ...prev,
        doctor_id: doctorId
      }))
    }
    
    if (category && ['general', 'dental', 'cell', 'membership', 'appointment'].includes(category)) {
      setFormData(prev => ({
        ...prev,
        category: category as 'general' | 'dental' | 'cell' | 'membership' | 'appointment'
      }))
    }
  }, [searchParams])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Helper function to show messages
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const categories = [
    { value: 'general', label: '一般咨询' },
    { value: 'dental', label: '口腔咨询' },
    { value: 'cell', label: '细胞咨询' },
    { value: 'membership', label: '权益卡咨询' },
    { value: 'appointment', label: '预约咨询' }
  ]

  const priorities = [
    { value: 'low', label: '低' },
    { value: 'normal', label: '普通' },
    { value: 'high', label: '高' },
    { value: 'urgent', label: '紧急' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const submitConsultation = async () => {
    try {
      const submitData = {
        ...formData,
        doctor_id: formData.doctor_id ? parseInt(formData.doctor_id) : undefined
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // Add authorization token if available
      const token = localStorage.getItem('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers,
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', '咨询提交成功！我们会尽快回复您。')
        setFormData({
          title: '',
          content: '',
          category: 'general',
          priority: 'normal',
          doctor_id: '',
          guest_name: '',
          guest_phone: '',
          guest_email: '',
          is_public: false
        })
      } else {
        showMessage('error', result.message || '提交失败，请重试')
      }
    } catch (error) {
      console.error('提交咨询失败:', error)
      showMessage('error', '提交失败，请检查网络连接')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.content) {
      showMessage('error', '请填写咨询标题和内容')
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setPendingAction(() => submitConsultation)
      setIsAuthModalOpen(true)
      return
    }
    
    setIsSubmitting(true)
    await submitConsultation()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">在线咨询</h1>
          <p className="text-gray-600 mb-8">
            欢迎咨询我们的专业团队。请填写以下表单，我们会尽快回复您的咨询。
          </p>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  咨询标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="请简要描述您的咨询问题"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  咨询类别 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  优先级
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-700 mb-2">
                  指定医生（可选）
                </label>
                <input
                  type="number"
                  id="doctor_id"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="医生ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                咨询内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={6}
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请详细描述您的问题或需求..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="guest_name" className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  id="guest_name"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="您的姓名"
                />
              </div>

              <div>
                <label htmlFor="guest_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  联系电话
                </label>
                <input
                  type="tel"
                  id="guest_phone"
                  name="guest_phone"
                  value={formData.guest_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="您的联系电话"
                />
              </div>

              <div>
                <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  id="guest_email"
                  name="guest_email"
                  value={formData.guest_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="您的邮箱地址"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                允许公开此咨询（其他用户可见）
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '提交中...' : '提交咨询'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">咨询须知</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 请详细描述您的问题，以便我们提供更准确的建议</li>
            <li>• 我们会在24小时内回复您的咨询</li>
            <li>• 紧急问题请直接致电我们的客服热线</li>
            <li>• 您可以选择是否公开您的咨询内容</li>
            <li>• 提供准确的联系方式有助于我们及时回复</li>
          </ul>
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false)
          setPendingAction(null)
        }}
        onSuccess={() => {
          if (pendingAction) {
            pendingAction()
            setPendingAction(null)
          }
          setIsAuthModalOpen(false)
        }}
      />
      
      <Footer />
    </div>
  )
}