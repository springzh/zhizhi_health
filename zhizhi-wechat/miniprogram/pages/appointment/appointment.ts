// appointment.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    doctors: [],
    services: [],
    selectedDoctor: { id: 0 },
    selectedService: { id: 0 },
    appointmentDate: '',
    patientInfo: {
      name: '',
      phone: ''
    },
    symptoms: '',
    loading: true
  },

  lifetimes: {
    attached() {
      this.loadData()
    }
  },

  methods: {
    async loadData() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      this.setData({ loading: true })

      try {
        const [doctors, services] = await Promise.all([
          api.getDoctors({ limit: 20 }),
          api.getServices()
        ])

        this.setData({
          doctors: doctors.data || [],
          services: services.data || [],
          loading: false
        })
      } catch (error) {
        console.error('加载数据失败:', error)
        this.setData({ loading: false })
      }
    },

    selectDoctor(e: any) {
      const doctorId = e.currentTarget.dataset.id
      const doctor = this.data.doctors.find(d => d.id === doctorId)
      this.setData({
        selectedDoctor: doctor,
        selectedService: null // 重置服务选择
      })
    },

    selectService(e: any) {
      const serviceId = e.currentTarget.dataset.id
      const service = this.data.services.find(s => s.id === serviceId)
      this.setData({
        selectedService: service
      })
    },

    onPatientInfoInput(e: any) {
      const field = e.currentTarget.dataset.field
      const value = e.detail.value
      
      this.setData({
        [`patientInfo.${field}`]: value
      })
    },

    onSymptomsInput(e: any) {
      this.setData({
        symptoms: e.detail.value
      })
    },

    onDateChange(e: any) {
      this.setData({
        appointmentDate: e.detail.value
      })
    },

    async submitAppointment() {
      if (!this.validateForm()) return

      this.setData({ loading: true })

      try {
        const appointmentData = {
          doctorId: this.data.selectedDoctor.id,
          serviceType: this.data.selectedService.name,
          appointmentTime: this.data.appointmentDate,
          patientInfo: this.data.patientInfo,
          symptoms: this.data.symptoms,
          notes: ''
        }

        await api.createAppointment(appointmentData)

        wx.showToast({
          title: '预约成功',
          icon: 'success'
        })

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)

      } catch (error) {
        wx.showToast({
          title: '预约失败',
          icon: 'error'
        })
        this.setData({ loading: false })
      }
    },

    validateForm() {
      const { selectedDoctor, selectedService, appointmentDate, patientInfo } = this.data

      if (!selectedDoctor || selectedDoctor.id === 0) {
        wx.showToast({
          title: '请选择医生',
          icon: 'none'
        })
        return false
      }

      if (!selectedService || selectedService.id === 0) {
        wx.showToast({
          title: '请选择服务',
          icon: 'none'
        })
        return false
      }

      if (!appointmentDate) {
        wx.showToast({
          title: '请选择预约日期',
          icon: 'none'
        })
        return false
      }

      if (!patientInfo.name || !patientInfo.phone) {
        wx.showToast({
          title: '请填写患者信息',
          icon: 'none'
        })
        return false
      }

      if (!/^1[3-9]\d{9}$/.test(patientInfo.phone)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return false
      }

      return true
    }
  },
})