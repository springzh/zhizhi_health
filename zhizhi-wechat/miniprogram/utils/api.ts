const BASE_URL = 'http://localhost:3001/api'

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
  private token: string = ''

  constructor() {
    this.token = wx.getStorageSync('token') || ''
  }

  static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api()
    }
    return Api.instance
  }

  private request<T = any>({ url, method = 'GET', data = {}, header = {} }: RequestOption): Promise<T> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${BASE_URL}${url}`,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : '',
          ...header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else if (res.statusCode === 401) {
            this.handleUnauthorized()
            reject(new Error('登录已过期，请重新登录'))
          } else {
            reject(new Error(res.data?.message || '请求失败'))
          }
        },
        fail: (err) => {
          reject(new Error('网络请求失败'))
        }
      })
    })
  }

  private handleUnauthorized() {
    this.token = ''
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    wx.navigateTo({
      url: '/pages/login/login'
    })
  }

  setToken(token: string) {
    this.token = token
    wx.setStorageSync('token', token)
  }

  clearToken() {
    this.token = ''
    wx.removeStorageSync('token')
  }

  // 认证相关
  async login(email: string, password: string) {
    const res = await this.request({
      url: '/auth/login',
      method: 'POST',
      data: { email, password }
    })
    this.setToken(res.token)
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

export const api = Api.getInstance()

export default api