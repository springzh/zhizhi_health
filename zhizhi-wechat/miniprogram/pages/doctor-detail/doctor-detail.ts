// doctor-detail.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    doctor: null,
    loading: true,
    activeTab: 'intro',
    scheduleWeek: 'this',
    scheduleDateRange: '',
    timeSlots: [],
    selectedDate: '',
    selectedTime: '',
    showDatePicker: false,
    showTimePicker: false,
    dates: [],
    times: []
  },

  lifetimes: {
    attached() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage.options || {}
      const doctorId = options.id
      
      if (doctorId) {
        this.loadDoctorDetail(doctorId)
        this.initializeSchedule()
      } else {
        wx.showToast({
          title: '医生ID不能为空',
          icon: 'error'
        })
        wx.navigateBack()
      }
    }
  },

  methods: {
    async loadDoctorDetail(doctorId: string) {
      this.setData({ loading: true })

      try {
        const res = await api.getDoctorDetail(parseInt(doctorId))
        this.setData({
          doctor: res.data,
          loading: false
        })
      } catch (error) {
        console.error('加载医生详情失败:', error)
        this.setData({ loading: false })
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    },

    navigateToAppointment() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      const doctorId = this.data.doctor?.id
      wx.navigateTo({
        url: `/pages/appointment/appointment?doctorId=${doctorId}`
      })
    },

    makePhoneCall() {
      const doctor = this.data.doctor
      const phone = doctor ? doctor.contact_phone : ''
      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        })
      } else {
        wx.showToast({
          title: '暂无联系电话',
          icon: 'none'
        })
      }
    },

    showLocation() {
      const doctor = this.data.doctor
      const hospital = doctor ? doctor.hospital : ''
      const address = doctor ? doctor.address : ''
      
      if (address) {
        wx.showModal({
          title: '医院地址',
          content: `${hospital}\n${address}`,
          showCancel: false
        })
      } else {
        wx.showToast({
          title: '暂无地址信息',
          icon: 'none'
        })
      }
    },

    switchTab(e: any) {
      const tab = e.currentTarget.dataset.tab
      this.setData({ activeTab: tab })
    },

    switchWeek(e: any) {
      const week = e.currentTarget.dataset.week
      this.setData({ scheduleWeek: week })
      this.updateScheduleDateRange()
      this.generateTimeSlots()
    },

    selectTimeSlot(e: any) {
      const time = e.currentTarget.dataset.time
      const status = e.currentTarget.dataset.status
      
      if (status === 'available') {
        this.setData({ selectedTime: time })
        wx.showToast({
          title: `已选择 ${time}`,
          icon: 'success'
        })
      } else if (status === 'occupied') {
        wx.showToast({
          title: '该时间段已被预约',
          icon: 'none'
        })
      }
    },

    makeConsultation() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      const doctorId = this.data.doctor?.id
      wx.navigateTo({
        url: `/pages/consultation/consultation?doctorId=${doctorId}`
      })
    },

    initializeSchedule() {
      this.updateScheduleDateRange()
      this.generateTimeSlots()
    },

    updateScheduleDateRange() {
      const today = new Date()
      const week = this.data.scheduleWeek
      
      let startDate, endDate
      if (week === 'this') {
        startDate = new Date(today)
        endDate = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)
      } else {
        startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        endDate = new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000)
      }

      const formatDate = (date: Date) => {
        return `${date.getMonth() + 1}月${date.getDate()}日`
      }

      const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`
      this.setData({ scheduleDateRange: dateRange })
    },

    generateTimeSlots() {
      const timeSlots = [
        { time: '08:00', status: 'available' },
        { time: '08:30', status: 'available' },
        { time: '09:00', status: 'occupied' },
        { time: '09:30', status: 'available' },
        { time: '10:00', status: 'available' },
        { time: '10:30', status: 'occupied' },
        { time: '11:00', status: 'available' },
        { time: '11:30', status: 'available' },
        { time: '14:00', status: 'available' },
        { time: '14:30', status: 'occupied' },
        { time: '15:00', status: 'available' },
        { time: '15:30', status: 'available' },
        { time: '16:00', status: 'available' },
        { time: '16:30', status: 'occupied' },
        { time: '17:00', status: 'available' },
        { time: '17:30', status: 'available' }
      ]
      
      this.setData({ timeSlots })
    },

    onShareAppMessage() {
      const doctor = this.data.doctor
      return {
        title: doctor ? `${doctor.name} - ${doctor.title}` : '',
        path: `/pages/doctor-detail/doctor-detail?id=${doctor ? doctor.id : ''}`,
        imageUrl: doctor ? doctor.avatar_url : ''
      }
    }
  },
})