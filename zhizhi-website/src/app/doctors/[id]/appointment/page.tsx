'use client'

import { useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

export default function AppointmentRedirect() {
  const params = useParams()
  const searchParams = useSearchParams()

  useEffect(() => {
    const service = searchParams.get('service')
    const newUrl = service 
      ? `/appointment/${params.id}?service=${encodeURIComponent(service)}`
      : `/appointment/${params.id}`
    
    window.location.href = newUrl
  }, [params.id, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl mb-4">正在跳转到预约页面...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  )
}