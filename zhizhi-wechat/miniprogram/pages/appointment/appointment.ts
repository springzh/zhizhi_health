// appointment.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    currentStep: 1,
    doctors: [],
    services: [],
    selectedDoctor: { id: 0 },
    selectedService: { id: 0 },
    appointmentDate: '',
    appointmentTime: '',
    patientInfo: {
      name: '',
      phone: ''
    },
    symptoms: '',
    loading: true,
    minDate: '',
    maxDate: ''
  },

  lifetimes: {
    attached() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      this.setData({
        minDate: this.getTodayDate(),
        maxDate: this.getMaxDate()
      })
      
      this.loadData()
    }
  },

  methods: {
    async loadData() {
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
        selectedService: { id: 0 } // 重置服务选择
      })
    },

    selectService(e: any) {
      const serviceId = e.currentTarget.dataset.id
      const service = this.data.services.find(s => s.id === serviceId)
      this.setData({
        selectedService: service
      })
    },

    nextStep() {
      if (this.data.currentStep === 1 && !this.data.selectedDoctor.id) {
        wx.showToast({
          title: '请选择医生',
          icon: 'none'
        })
        return
      }

      if (this.data.currentStep === 2 && !this.data.selectedService.id) {
        wx.showToast({
          title: '请选择服务',
          icon: 'none'
        })
        return
      }

      this.setData({
        currentStep: this.data.currentStep + 1
      })
    },

    prevStep() {
      this.setData({
        currentStep: this.data.currentStep - 1
      })
    },

    goBack() {
      wx.navigateBack()
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

    onTimeChange(e: any) {
      this.setData({
        appointmentTime: e.detail.value
      })
    },

    async submitAppointment() {
      if (!this.validateForm()) return

      this.setData({ loading: true })

      try {
        const appointmentData = {
          doctorId: this.data.selectedDoctor.id,
          serviceType: this.data.selectedService.name,
          appointmentDate: this.data.appointmentDate,
          appointmentTime: this.data.appointmentTime,
          patientInfo: this.data.patientInfo,
          symptoms: this.data.symptoms,
          notes: '',
          status: 'pending'
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
      const { selectedDoctor, selectedService, appointmentDate, appointmentTime, patientInfo } = this.data

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

      if (!appointmentTime) {
        wx.showToast({
          title: '请选择预约时间',
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
    },

    getTodayDate() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    getMaxDate() {
      const maxDate = new Date()
      maxDate.setMonth(maxDate.getMonth() + 3) // 最多提前3个月预约
      const year = maxDate.getFullYear()
      const month = String(maxDate.getMonth() + 1).padStart(2, '0')
      const day = String(maxDate.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  },
})