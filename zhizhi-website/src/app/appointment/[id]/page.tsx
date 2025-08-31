'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DoctorList from '@/components/DoctorList'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

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
  consultation_price: number
  experience: string
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
}

export default function UniversalAppointmentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDoctorList, setShowDoctorList] = useState(false)
  
  // Form state
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || '')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Available time slots
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([])

  useEffect(() => {
    // Check if doctor ID is provided in URL
    const doctorId = params.id
    if (doctorId) {
      fetchDoctorDetail(doctorId as string)
    } else {
      setShowDoctorList(true)
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (selectedDate) {
      generateAvailableTimes(selectedDate)
    }
  }, [selectedDate])

  const fetchDoctorDetail = async (doctorId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/doctors/${doctorId}`)
      const data = await response.json()
      if (data.success) {
        setDoctor(data.data)
        if (!selectedService && data.data.service_types.length > 0) {
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

  const handleDoctorSelect = (selectedDoctor: Doctor) => {
    setDoctor(selectedDoctor)
    setShowDoctorList(false)
    if (!selectedService && selectedDoctor.service_types.length > 0) {
      setSelectedService(selectedDoctor.service_types[0])
    }
    generateAvailableDates()
  }

  const handleBackToDoctorList = () => {
    setDoctor(null)
    setShowDoctorList(true)
    setSelectedDate('')
    setSelectedTime('')
    setAvailableDates([])
    setAvailableTimes([])
  }

  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends (Sunday = 0, Saturday = 6)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    
    setAvailableDates(dates)
  }

  const generateAvailableTimes = (date: string) => {
    const times: TimeSlot[] = []
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()
    
    // Different time slots based on day of week
    const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
    const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
    const eveningSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
    
    // Add morning slots
    morningSlots.forEach(time => {
      times.push({
        date,
        time,
        available: Math.random() > 0.3 // 70% availability
      })
    })
    
    // Add afternoon slots
    afternoonSlots.forEach(time => {
      times.push({
        date,
        time,
        available: Math.random() > 0.3 // 70% availability
      })
    })
    
    // Add evening slots on weekdays
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      eveningSlots.forEach(time => {
        times.push({
          date,
          time,
          available: Math.random() > 0.5 // 50% availability
        })
      })
    }
    
    setAvailableTimes(times)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!doctor || !selectedDate || !selectedTime || !patientName || !patientPhone) {
      alert('请填写所有必填项')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const appointmentData = {
        doctor_id: doctor.id,
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_email: patientEmail,
        service_type: selectedService,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        symptoms: symptoms,
        status: 'pending'
      }
      
      const response = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('预约成功！我们将在24小时内与您联系确认预约信息。')
        // Reset form
        setPatientName('')
        setPatientPhone('')
        setPatientEmail('')
        setSymptoms('')
        setSelectedDate('')
        setSelectedTime('')
      } else {
        alert('预约失败：' + result.message)
      }
    } catch (err) {
      console.error('Error submitting appointment:', err)
      alert('预约失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    }
    return date.toLocaleDateString('zh-CN', options)
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

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {doctor ? `预约咨询 - ${doctor.name}` : '预约咨询'}
              </h1>
              <p className="text-xl text-blue-100">
                {doctor ? `${doctor.name} · ${doctor.specialty}` : '选择医生并预约咨询'}
              </p>
              {doctor && (
                <button
                  onClick={handleBackToDoctorList}
                  className="mt-4 text-blue-100 hover:text-white underline text-sm"
                >
                  ← 重新选择医生
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Appointment Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Left Panel - Doctor List or Doctor Info */}
                <div className="md:w-2/5 bg-gray-50 p-6 border-r border-gray-200">
                  {showDoctorList ? (
                    <DoctorList onDoctorSelect={handleDoctorSelect} selectedDoctor={doctor} />
                  ) : doctor ? (
                    <div className="space-y-6">
                      {/* Doctor Info */}
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-3xl text-white">👨‍⚕️</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                        <p className="text-blue-600 font-medium mb-1">{doctor.title}</p>
                        <p className="text-sm text-gray-600 mb-1">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500 mb-3">{doctor.hospital}</p>
                        
                        <div className="flex items-center justify-center mb-3">
                          <div className="flex text-yellow-400 text-sm">
                            ★★★★★
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {doctor.rating}
                          </span>
                        </div>
                        
                        <div className="text-lg font-semibold text-blue-600 mb-2">
                          ¥{doctor.consultation_price}/次
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {doctor.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {doctor.experience}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {doctor.consultation_count}+ 咨询
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">擅长项目：</h4>
                        <div className="flex flex-wrap gap-1">
                          {doctor.service_types.map((service, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-gray-500">请选择医生</div>
                    </div>
                  )}
                </div>

                {/* Right Panel - Appointment Form */}
                <div className="md:w-3/5 p-6">
                  {doctor ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Service Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          选择服务类型 *
                        </label>
                        <select
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          {doctor.service_types.map((service, index) => (
                            <option key={index} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>

                      {/* Date Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          选择日期 *
                        </label>
                        <select
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value)
                            setSelectedTime('')
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">请选择日期</option>
                          {availableDates.map((date) => (
                            <option key={date} value={date}>
                              {formatDate(date)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time Selection */}
                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            选择时间 *
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {availableTimes.map((slot, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedTime(slot.time)}
                                disabled={!slot.available}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  selectedTime === slot.time
                                    ? 'bg-blue-600 text-white'
                                    : slot.available
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Patient Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            患者姓名 *
                          </label>
                          <input
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            联系电话 *
                          </label>
                          <input
                            type="tel"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          电子邮箱
                        </label>
                        <input
                          type="email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          症状描述
                        </label>
                        <textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请简要描述您的症状或需要咨询的问题..."
                        />
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">预约须知：</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              <li>请提前15分钟到达医院</li>
                              <li>携带有效身份证件</li>
                              <li>如需改期请提前24小时联系</li>
                              <li>咨询费用：¥{doctor.consultation_price}/次</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !selectedDate || !selectedTime || !patientName || !patientPhone}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                          isSubmitting || !selectedDate || !selectedTime || !patientName || !patientPhone
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isSubmitting ? '提交中...' : '确认预约'}
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <div className="text-6xl mb-4">👨‍⚕️</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">请先选择医生</h3>
                        <p className="text-gray-600">从左侧列表中选择您要预约的医生</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}