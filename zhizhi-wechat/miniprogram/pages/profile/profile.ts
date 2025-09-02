// profile.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  data: {
    userInfo: null,
    loading: true,
    showLogoutModal: false
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

    navigateToLogin() {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    },

    navigateToAppointments() {
      if (!this.checkLogin()) return
      wx.navigateTo({
        url: '/pages/my-appointments/my-appointments'
      })
    },

    navigateToSettings() {
      wx.navigateTo({
        url: '/pages/settings/settings'
      })
    },

    navigateToAbout() {
      wx.showModal({
        title: '关于我们',
        content: '知治口腔服务平台\n\n致力于为用户提供专业的口腔健康服务，包括在线预约、医生咨询、健康管理等一站式服务。',
        showCancel: false
      })
    },

    checkLogin() {
      if (!app.globalData.isLoggedIn) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        })
        return false
      }
      return true
    },

    showLogoutConfirm() {
      this.setData({
        showLogoutModal: true
      })
    },

    hideLogoutModal() {
      this.setData({
        showLogoutModal: false
      })
    },

    handleLogout() {
      app.logout()
      this.hideLogoutModal()
      
      wx.showToast({
        title: '已退出登录',
        icon: 'success'
      })
    },

    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: '400-123-4567'
      })
    },

    copyWechat() {
      wx.setClipboardData({
        data: 'zhizhi_health',
        success: () => {
          wx.showToast({
            title: '微信号已复制',
            icon: 'success'
          })
        }
      })
    },

    onShareAppMessage() {
      return {
        title: '知治口腔 - 专业口腔健康服务平台',
        path: '/pages/index/index',
        imageUrl: '/images/share-image.jpg'
      }
    },

    onPullDownRefresh() {
      this.loadUserInfo()
      wx.stopPullDownRefresh()
    }
  },
})