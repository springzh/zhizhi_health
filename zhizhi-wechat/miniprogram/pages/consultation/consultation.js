// consultation.js
// 获取应用实例
const app = getApp()
import api from '../../utils/api'

Component({
  data: {
    availableDoctors: [],
    consultationHistory: [],
    loading: true
  },

  lifetimes: {
    attached() {
      this.loadConsultationData()
    }
  },

  methods: {
    async loadConsultationData() {
      this.setData({ loading: true })

      try {
        // 模拟在线医生数据
        const availableDoctors = [
          {
            id: 1,
            name: '张医生',
            title: '主任医师',
            hospital: '知治口腔医院',
            avatar_url: '/images/doctor1.png',
            rating: 4.9,
            consultation_count: 1250,
            consultation_price: 50,
            online: true
          },
          {
            id: 2,
            name: '李医生',
            title: '副主任医师',
            hospital: '知治口腔医院',
            avatar_url: '/images/doctor2.png',
            rating: 4.8,
            consultation_count: 980,
            consultation_price: 40,
            online: true
          },
          {
            id: 3,
            name: '王医生',
            title: '主治医师',
            hospital: '知治口腔医院',
            avatar_url: '/images/doctor3.png',
            rating: 4.7,
            consultation_count: 650,
            consultation_price: 30,
            online: false
          },
          {
            id: 4,
            name: '陈医生',
            title: '专家医师',
            hospital: '知治口腔医院',
            avatar_url: '/images/doctor4.png',
            rating: 5.0,
            consultation_count: 2100,
            consultation_price: 80,
            online: true
          }
        ]

        // 模拟咨询记录数据
        const consultationHistory = [
          {
            id: 1,
            doctor: {
              name: '张医生',
              title: '主任医师',
              avatar_url: '/images/doctor1.png'
            },
            type: '文字咨询',
            time: '2024-01-15 14:30',
            content: '牙齿敏感，遇到冷热食物会酸痛，请问是什么原因？',
            status: 'completed',
            statusText: '已完成'
          },
          {
            id: 2,
            doctor: {
              name: '李医生',
              title: '副主任医师',
              avatar_url: '/images/doctor2.png'
            },
            type: '图片咨询',
            time: '2024-01-14 10:15',
            content: '牙龈出血，上传了照片请医生查看',
            status: 'ongoing',
            statusText: '进行中'
          },
          {
            id: 3,
            doctor: {
              name: '王医生',
              title: '主治医师',
              avatar_url: '/images/doctor3.png'
            },
            type: '语音咨询',
            time: '2024-01-12 16:45',
            content: '牙齿矫正咨询，了解了矫正方案和费用',
            status: 'completed',
            statusText: '已完成'
          }
        ]

        this.setData({
          availableDoctors,
          consultationHistory,
          loading: false
        })
      } catch (error) {
        console.error('加载咨询数据失败:', error)
        this.setData({ loading: false })
      }
    },

    startTextConsultation() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      wx.navigateTo({
        url: '/pages/consultation-type/consultation-type?type=text'
      })
    },

    startImageConsultation() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      wx.navigateTo({
        url: '/pages/consultation-type/consultation-type?type=image'
      })
    },

    startVoiceConsultation() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      wx.navigateTo({
        url: '/pages/consultation-type/consultation-type?type=voice'
      })
    },

    startVideoConsultation() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      wx.navigateTo({
        url: '/pages/consultation-type/consultation-type?type=video'
      })
    },

    selectDoctor(e) {
      const doctorId = e.currentTarget.dataset.id
      const doctor = this.data.availableDoctors.find(d => d.id === doctorId)
      
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      wx.navigateTo({
        url: `/pages/consultation-doctor/consultation-doctor?doctorId=${doctorId}`
      })
    },

    viewConsultationDetail(e) {
      const consultationId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/consultation-detail/consultation-detail?id=${consultationId}`
      })
    },

    continueConsultation(e) {
      const consultationId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/consultation-chat/consultation-chat?id=${consultationId}`
      })
    },

    viewAllHistory() {
      wx.navigateTo({
        url: '/pages/consultation-history/consultation-history'
      })
    }
  }
})