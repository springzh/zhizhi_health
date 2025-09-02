// doctor-detail.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    doctor: null,
    loading: true,
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