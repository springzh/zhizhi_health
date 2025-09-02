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
      const userInfo = await api.getUserInfo()
      this.globalData.userInfo = userInfo
      wx.setStorageSync('userInfo', userInfo)
      return userInfo
    } catch (error) {
      console.error('获取用户信息失败:', error)
      this.logout()
      throw error
    }
  },

  async login(email: string, password: string): Promise<any> {
    try {
      const res = await api.login(email, password)
      this.globalData.token = res.token
      this.globalData.isLoggedIn = true
      
      // 获取用户信息
      const userInfo = await this.getUserInfo()
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