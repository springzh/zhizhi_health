'use client'

import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'

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
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/doctors')
        const data = await response.json()
        if (data.success) {
          setDoctors(data.data)
        } else {
          setError('Failed to fetch doctors')
        }
      } catch (err) {
        setError('Error fetching doctors')
        console.error('Error fetching doctors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

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

  if (error) {
    return (
      <div className="min-h-screen">
          <div className="flex items-center justify-center h-96">
          <div className="text-xl text-red-600">错误: {error}</div>
        </div>
        <Footer />
      </div>
    )
  }

  const locations = ["全部", "广州", "深圳"]
  const specialties = ["全部", "口腔修复", "牙周治疗", "牙齿美容", "儿童牙科", "口腔外科", "根管治疗", "口腔正畸", "口腔综合"]

  return (
    <div className="min-h-screen">
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                专业医生团队
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                汇聚资深口腔医学专家，为您提供专业、安全、贴心的口腔健康服务
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/appointment" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block text-center">
                  立即预约
                </a>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  在线咨询
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索医生姓名、医院或专长..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-4">
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                推荐医生
              </h2>
              <p className="text-gray-600">为您精选优质口腔医生资源</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-2xl text-white">👨‍⚕️</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mb-1">{doctor.title}</p>
                      <p className="text-sm text-gray-600 mb-1">{doctor.specialty}</p>
                      <p className="text-xs text-gray-500 mb-3">{doctor.hospital} · {doctor.location}</p>
                      
                      <div className="flex items-center justify-center mb-3">
                        <div className="flex text-yellow-400 text-sm">
                          ★★★★★
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {doctor.rating}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        {doctor.consultation_count}+ 咨询
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">擅长项目：</h4>
                      <div className="flex flex-wrap gap-1">
                        {doctor.service_types.slice(0, 3).map((service, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {service}
                          </span>
                        ))}
                        {doctor.service_types.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{doctor.service_types.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a 
                        href={`/appointment/${doctor.id}`}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-block text-center"
                      >
                        预约咨询
                      </a>
                      <button 
                        onClick={() => window.location.href = `/doctors/${doctor.id}`}
                        className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">专业医生</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10万+</div>
                <div className="text-gray-600">成功案例</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">满意度</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15年</div>
                <div className="text-gray-600">平均经验</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              找到适合您的医生
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              专业团队为您提供个性化的口腔健康解决方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/appointment" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block text-center">
                立即预约
              </a>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
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