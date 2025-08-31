'use client'

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
  consultation_price: number
  experience: string
}

interface DoctorListProps {
  onDoctorSelect: (doctor: Doctor) => void
  selectedDoctor?: Doctor | null
}

export default function DoctorList({ onDoctorSelect, selectedDoctor }: DoctorListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('全部')
  const [selectedSpecialty, setSelectedSpecialty] = useState('全部')

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

  const locations = ["全部", "广州", "深圳"]
  const specialties = ["全部", "口腔修复", "牙周治疗", "牙齿美容", "儿童牙科", "口腔外科", "根管治疗", "口腔正畸", "口腔综合"]

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === '全部' || doctor.location === selectedLocation
    const matchesSpecialty = selectedSpecialty === '全部' || doctor.specialty === selectedSpecialty
    
    return matchesSearch && matchesLocation && matchesSpecialty
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">错误: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">选择医生</h2>
        <p className="text-gray-600">请选择您要预约的医生</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索医生姓名、医院或专长..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
          
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            onClick={() => onDoctorSelect(doctor)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedDoctor?.id === doctor.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-white">👨‍⚕️</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-1">{doctor.title}</p>
                    <p className="text-sm text-gray-600 mb-1">{doctor.specialty}</p>
                    <p className="text-xs text-gray-500">{doctor.hospital} · {doctor.location}</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    doctor.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {doctor.is_available ? '可预约' : '暂不可约'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 text-sm">
                        ★★★★★
                      </div>
                      <span className="text-sm text-gray-600 ml-1">
                        {doctor.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {doctor.consultation_count}+ 咨询
                    </span>
                  </div>
                  
                  <span className="text-sm font-semibold text-blue-600">
                    ¥{doctor.consultation_price}/次
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">没有找到符合条件的医生</p>
        </div>
      )}
    </div>
  )
}