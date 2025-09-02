const BASE_URL = 'http://127.0.0.1:3001/api'

interface RequestOption {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
}

interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
}

class Api {
  private static instance: Api
  private static token: string = ''

  constructor() {
    Api.token = wx.getStorageSync('token') || ''
  }

  static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api()
    }
    return Api.instance
  }

  private request<T = any>({ url, method = 'GET', data = {}, header = {} }: RequestOption): Promise<T> {
    return new Promise((resolve, reject) => {
      const authToken = Api.token ? `Bearer ${Api.token}` : ''
      console.log(`API请求: ${method} ${BASE_URL}${url}`, data)
      console.log(`Authorization头: ${authToken}`)
      console.log(`当前token: ${Api.token}`)
      
      wx.request({
        url: `${BASE_URL}${url}`,
        method,
        data,
        timeout: 10000, // 10秒超时
        header: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
          ...header
        },
        success: (res) => {
          console.log(`API响应: ${res.statusCode}`, res.data)
          if (res.statusCode === 200) {
            resolve(res.data)
          } else if (res.statusCode === 401) {
            this.handleUnauthorized()
            reject(new Error('登录已过期，请重新登录'))
          } else {
            reject(new Error(res.data?.message || `请求失败 (${res.statusCode})`))
          }
        },
        fail: (err) => {
          console.error(`API请求失败: ${method} ${BASE_URL}${url}`, err)
          reject(new Error(`网络请求失败: ${err.errMsg || '未知错误'}`))
        }
      })
    })
  }

  private handleUnauthorized() {
    Api.token = ''
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    wx.navigateTo({
      url: '/pages/login/login'
    })
  }

  setToken(token: string) {
    console.log('设置token:', token)
    Api.token = token
    wx.setStorageSync('token', token)
    console.log('Token设置完成，当前token:', Api.token)
  }

  clearToken() {
    Api.token = ''
    wx.removeStorageSync('token')
  }

  // 认证相关
  async login(email: string, password: string) {
    const res = await this.request({
      url: '/auth/login',
      method: 'POST',
      data: { email, password }
    })
    this.setToken(res.data.token)
    return res
  }

  async register(email: string, password: string, name: string) {
    return this.request({
      url: '/auth/register',
      method: 'POST',
      data: { email, password, name }
    })
  }

  async getUserInfo() {
    return this.request({
      url: '/auth/me'
    })
  }

  async updateProfile(data: any) {
    return this.request({
      url: '/auth/profile',
      method: 'PUT',
      data
    })
  }

  // 医生相关
  async getDoctors(params?: any) {
    return this.request({
      url: '/doctors',
      method: 'GET',
      data: params
    })
  }

  async getDoctorDetail(id: number) {
    return this.request({
      url: `/doctors/${id}`
    })
  }

  // 服务相关
  async getServices() {
    return this.request({
      url: '/services'
    })
  }

  async getMembership() {
    return this.request({
      url: '/membership'
    })
  }

  async getRightsCards() {
    return this.request({
      url: '/rights-cards/cards'
    })
  }

  // 预约相关
  async createAppointment(data: any) {
    return this.request({
      url: '/appointments',
      method: 'POST',
      data
    })
  }

  // FAQ相关
  async getFaqCategories() {
    return this.request({
      url: '/faq/categories'
    })
  }

  async getPopularFaqs() {
    return this.request({
      url: '/faq/popular'
    })
  }

  async getFaqs(params?: any) {
    return this.request({
      url: '/faq',
      method: 'GET',
      data: params
    })
  }

  async getFaqDetail(id: number) {
    return this.request({
      url: `/faq/${id}`
    })
  }
}

// 创建单例实例
const apiInstance = Api.getInstance()

export const api = apiInstance

export default apiInstance