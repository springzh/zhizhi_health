// app.ts
import api from './utils/api'

interface IAppOption {
  globalData: {
    userInfo?: any
    token?: string
    isLoggedIn: boolean
  }
  checkLoginStatus(): boolean
  getUserInfo(): Promise<any>
  login(email: string, password: string): Promise<any>
  logout(): void
}

App<IAppOption>({
  globalData: {
    userInfo: null,
    token: '',
    isLoggedIn: false
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查登录状态
    this.checkLoginStatus()
  },

  checkLoginStatus(): boolean {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    if (token && userInfo) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
      this.globalData.isLoggedIn = true
      api.setToken(token)
      return true
    }
    
    this.globalData.isLoggedIn = false
    return false
  },

  async getUserInfo(): Promise<any> {
    try {
      console.log('获取用户信息...')
      const userInfo = await api.getUserInfo()
      console.log('用户信息获取成功:', userInfo)
      
      this.globalData.userInfo = userInfo
      wx.setStorageSync('userInfo', userInfo)
      return userInfo
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取用户信息失败，不要自动登出，而是先检查token是否存在
      const token = wx.getStorageSync('token')
      if (!token) {
        this.logout()
      }
      throw error
    }
  },

  async login(email: string, password: string): Promise<any> {
    try {
      console.log('开始登录...')
      const res = await api.login(email, password)
      console.log('登录响应:', res)
      
      // 设置全局状态
      this.globalData.token = res.data.token
      this.globalData.isLoggedIn = true
      
      // 获取用户信息（此时token应该已经被api.login方法设置）
      const userInfo = await this.getUserInfo()
      console.log('用户信息获取成功:', userInfo)
      
      return { ...res, userInfo }
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  },

  logout(): void {
    this.globalData.token = ''
    this.globalData.userInfo = null
    this.globalData.isLoggedIn = false
    
    api.clearToken()
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    
    wx.reLaunch({
      url: '/pages/login/login'
    })
  }
})