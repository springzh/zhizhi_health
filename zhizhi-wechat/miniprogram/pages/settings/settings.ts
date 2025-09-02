// settings.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    userInfo: null,
    loading: true,
    notifications: {
      appointment: true,
      promotion: false,
      system: true
    }
  },

  lifetimes: {
    attached() {
      this.loadUserInfo()
    }
  },

  methods: {
    async loadUserInfo() {
      if (!app.globalData.isLoggedIn) {
        this.setData({
          userInfo: null,
          loading: false
        })
        return
      }

      this.setData({ loading: true })

      try {
        const userInfo = await app.getUserInfo()
        this.setData({
          userInfo,
          loading: false
        })
      } catch (error) {
        console.error('加载用户信息失败:', error)
        this.setData({ loading: false })
      }
    },

    onNameInput(e: any) {
      this.setData({
        'userInfo.name': e.detail.value
      })
    },

    onPhoneInput(e: any) {
      this.setData({
        'userInfo.phone': e.detail.value
      })
    },

    async saveProfile() {
      if (!this.data.userInfo) return

      try {
        await api.updateProfile({
          name: this.data.userInfo.name,
          phone: this.data.userInfo.phone
        })

        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })

        // 更新全局用户信息
        app.globalData.userInfo = this.data.userInfo
        wx.setStorageSync('userInfo', this.data.userInfo)

      } catch (error) {
        wx.showToast({
          title: '保存失败',
          icon: 'error'
        })
      }
    },

    toggleNotification(e: any) {
      const type = e.currentTarget.dataset.type
      this.setData({
        [`notifications.${type}`]: !this.data.notifications[type]
      })
    },

    clearCache() {
      wx.showModal({
        title: '确认清除',
        content: '确定要清除缓存吗？',
        success: (res) => {
          if (res.confirm) {
            wx.clearStorageSync()
            wx.showToast({
              title: '缓存已清除',
              icon: 'success'
            })
          }
        }
      })
    },

    aboutUs() {
      wx.showModal({
        title: '关于我们',
        content: '知治口腔服务平台\n\n版本：v1.0.0\n\n致力于为用户提供专业的口腔健康服务。',
        showCancel: false
      })
    },

    userAgreement() {
      wx.showModal({
        title: '用户协议',
        content: '欢迎使用知治口腔服务平台！\n\n请仔细阅读以下条款...',
        showCancel: false
      })
    },

    privacyPolicy() {
      wx.showModal({
        title: '隐私政策',
        content: '我们重视您的隐私保护...\n\n请仔细阅读以下条款...',
        showCancel: false
      })
    },

    logout() {
      wx.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            app.logout()
          }
        }
      })
    }
  },
})