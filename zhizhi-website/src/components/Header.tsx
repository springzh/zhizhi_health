'use client'

import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">知治健康</h1>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <a href="/" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                首页
              </a>
              <a href="/services/dental" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                口腔服务
              </a>
              <a href="/membership" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                医疗权益卡
              </a>
              <a href="/services/cell" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                细胞服务
              </a>
              <a href="/doctors" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                医生资源
              </a>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="/appointment" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors inline-block">
              立即预约
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="/" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                首页
              </a>
              <a href="/services/dental" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                口腔服务
              </a>
              <a href="/membership" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                医疗权益卡
              </a>
              <a href="/services/cell" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                细胞服务
              </a>
              <a href="/doctors" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                医生资源
              </a>
              <a href="/appointment" className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors inline-block text-center">
                立即预约
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}