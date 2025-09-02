'use client'

import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Doctor {
  id: number
  name: string
  title: string
  specialty: string
  hospital: string
  location: string
  rating: string
  consultation_count: number
  introduction: string
  service_types: string[]
  avatar_url: string
  is_available: boolean
  education: string[]
  experience: string
  certifications: string[]
  languages: string[]
  consultation_price: number
}

export default function DoctorDetail() {
  const params = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState('')

  useEffect(() => {
    const fetchDoctorDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/doctors/${params.id}`)
        const data = await response.json()
        if (data.success) {
          setDoctor(data.data)
          if (data.data.service_types && data.data.service_types.length > 0) {
            setSelectedService(data.data.service_types[0])
          }
        } else {
          setError('Failed to fetch doctor details')
        }
      } catch (err) {
        setError('Error fetching doctor details')
        console.error('Error fetching doctor details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDoctorDetail()
    }
  }, [params.id])

  const handleBookAppointment = () => {
    if (doctor) {
      window.location.href = `/appointment/${doctor.id}?service=${encodeURIComponent(selectedService)}`
    }
  }

  const handleConsultation = () => {
    if (doctor) {
      window.location.href = `/consultation?doctor_id=${doctor.id}&category=dental`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
                <div className="flex items-center justify-center h-96">
          <div className="text-xl">加载中...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen">
                <div className="flex items-center justify-center h-96">
          <div className="text-xl text-red-600">错误: {error || '医生信息不存在'}</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
            
      <main>
        {/* Hero Section with Doctor Info */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="text-center lg:text-left">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto lg:mx-0 mb-4 flex items-center justify-center">
                  <span className="text-4xl text-white">👨‍⚕️</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{doctor.name}</h1>
                <p className="text-xl text-blue-100 mb-2">{doctor.title}</p>
                <p className="text-lg text-blue-100 mb-4">{doctor.specialty}</p>
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    ★★★★★
                  </div>
                  <span className="text-lg text-blue-100 ml-2">
                    {doctor.rating} ({doctor.consultation_count}+ 咨询)
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${doctor.is_available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {doctor.is_available ? '可预约' : '暂不可约'}
                  </span>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">医生简介</h3>
                  <p className="text-blue-100 leading-relaxed mb-6">
                    {doctor.introduction}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">执业医院</h4>
                      <p className="text-blue-100">{doctor.hospital}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">所在地区</h4>
                      <p className="text-blue-100">{doctor.location}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">从业经验</h4>
                      <p className="text-blue-100">{doctor.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">咨询价格</h4>
                      <p className="text-blue-100">¥{doctor.consultation_price}/次</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleBookAppointment}
                      disabled={!doctor.is_available}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${doctor.is_available ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                    >
                      {doctor.is_available ? '立即预约' : '暂不可约'}
                    </button>
                    <button 
                      onClick={handleConsultation}
                      className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      在线咨询
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">擅长项目</h2>
              <p className="text-gray-600">医生擅长的诊疗项目和服务类型</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {(doctor.service_types || []).map((service, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedService === service ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
                  onClick={() => setSelectedService(service)}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{service}</h3>
                  <p className="text-sm text-gray-600">专业诊疗服务</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education and Experience */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">教育背景</h2>
                <div className="space-y-4">
                  {(doctor.education || []).map((edu, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-1">{edu}</h3>
                      <p className="text-sm text-gray-600">专业医学教育背景</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">专业认证</h2>
                <div className="space-y-4">
                  {(doctor.certifications || []).map((cert, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-1">{cert}</h3>
                      <p className="text-sm text-gray-600">专业资质认证</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">语言能力</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {(doctor.languages || []).map((lang, index) => (
                  <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">患者评价</h2>
              <p className="text-gray-600">来自真实患者的反馈和评价</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample reviews */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">张女士</h4>
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">医生非常专业，态度也很好，治疗过程很顺利，效果满意。</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">李先生</h4>
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">经验丰富，诊断准确，治疗方案合理，推荐给大家。</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">王女士</h4>
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">服务态度很好，耐心解答问题，治疗效果超出预期。</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}