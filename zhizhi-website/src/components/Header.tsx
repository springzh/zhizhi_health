'use client'

import { useState } from 'react';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">知治健康</a>
            </div>
          </div>
          
          <div className="flex items-center justify-between w-full max-w-5xl mx-8">
            <nav className="hidden md:flex md:space-x-8">
                <a href="/services/dental" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                口腔服务
              </a>
                <a href="/rights-cards" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                健康权益卡
              </a>
              <a href="/services/cell" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                细胞服务
              </a>
              <a href="/doctors" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                医生资源
              </a>
              <a href="/consultation" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                在线咨询
              </a>
              <a href="/faq" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                常见问题
              </a>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <a href="/appointment" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors inline-block">
                立即预约
              </a>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary"
                  >
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                      {user?.nickname?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium">
                      {user?.nickname || user?.email}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <a
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        账号管理
                      </a>
                      <a
                        href="/my-consultations"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        我的咨询
                      </a>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  登录/注册
                </button>
              )}
            </div>
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
              <a href="/services/dental" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                口腔服务
              </a>
              <a href="/rights-cards" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                健康权益卡
              </a>
              <a href="/services/cell" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                细胞服务
              </a>
              <a href="/doctors" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                医生资源
              </a>
              <a href="/consultation" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                在线咨询
              </a>
              <a href="/faq" className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium">
                常见问题
              </a>
              <a href="/appointment" className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors inline-block text-center mt-4">
                立即预约
              </a>
              {!isAuthenticated && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  登录/注册
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  )
}