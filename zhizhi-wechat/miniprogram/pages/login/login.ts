// login.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  data: {
    isLogin: true,
    email: '',
    password: '',
    name: '',
    loading: false,
    showPassword: false,
    rememberMe: false
  },

  lifetimes: {
    attached() {
      // 检查是否已登录
      if (app.globalData.isLoggedIn) {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }

      // 加载记住的登录信息
      const savedEmail = wx.getStorageSync('savedEmail')
      const savedPassword = wx.getStorageSync('savedPassword')
      if (savedEmail && savedPassword) {
        this.setData({
          email: savedEmail,
          password: savedPassword,
          rememberMe: true
        })
      }
    }
  },

  methods: {
    toggleAuthMode() {
      this.setData({
        isLogin: !this.data.isLogin,
        email: '',
        password: '',
        name: ''
      })
    },

    onEmailInput(e: any) {
      this.setData({
        email: e.detail.value
      })
    },

    onPasswordInput(e: any) {
      this.setData({
        password: e.detail.value
      })
    },

    onNameInput(e: any) {
      this.setData({
        name: e.detail.value
      })
    },

    togglePassword() {
      const newState = !this.data.showPassword
      console.log('切换密码显示状态:', newState)
      this.setData({
        showPassword: newState
      })
    },

    toggleRememberMe() {
      this.setData({
        rememberMe: !this.data.rememberMe
      })
    },

    validateForm() {
      const { email, password, name, isLogin } = this.data

      if (!email || !password) {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return false
      }

      if (!isLogin && !name) {
        wx.showToast({
          title: '请填写姓名',
          icon: 'none'
        })
        return false
      }

      if (!this.validateEmail(email)) {
        wx.showToast({
          title: '邮箱格式不正确',
          icon: 'none'
        })
        return false
      }

      if (password.length < 6) {
        wx.showToast({
          title: '密码至少6位',
          icon: 'none'
        })
        return false
      }

      return true
    },

    validateEmail(email: string) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    async handleSubmit() {
      if (!this.validateForm()) return

      this.setData({ loading: true })

      try {
        if (this.data.isLogin) {
          await this.handleLogin()
        } else {
          await this.handleRegister()
        }
      } catch (error) {
        console.error('操作失败:', error)
      } finally {
        this.setData({ loading: false })
      }
    },

    async handleLogin() {
      const { email, password, rememberMe } = this.data

      try {
        const res = await app.login(email, password)

        // 保存登录信息
        if (rememberMe) {
          wx.setStorageSync('savedEmail', email)
          wx.setStorageSync('savedPassword', password)
        } else {
          wx.removeStorageSync('savedEmail')
          wx.removeStorageSync('savedPassword')
        }

        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)

      } catch (error) {
        wx.showToast({
          title: error.message || '登录失败',
          icon: 'error'
        })
      }
    },

    async handleRegister() {
      const { email, password, name } = this.data

      try {
        await app.register(email, password, name)

        wx.showToast({
          title: '注册成功，请登录',
          icon: 'success'
        })

        // 切换到登录模式
        this.setData({
          isLogin: true,
          password: ''
        })

      } catch (error) {
        wx.showToast({
          title: error.message || '注册失败',
          icon: 'error'
        })
      }
    },

    handleWechatLogin() {
      wx.showToast({
        title: '微信登录暂未开放',
        icon: 'none'
      })
    },

    forgotPassword() {
      wx.showModal({
        title: '忘记密码',
        content: '请联系客服重置密码',
        showCancel: false
      })
    }
  },
})