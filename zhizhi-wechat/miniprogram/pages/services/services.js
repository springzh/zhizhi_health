// services.js
// 获取应用实例
const app = getApp()
import api from '../../utils/api'

Component({
  data: {
    services: [],
    filteredServices: [],
    activeCategory: 'all',
    loading: true
  },

  lifetimes: {
    attached() {
      this.loadServices()
    }
  },

  methods: {
    async loadServices() {
      this.setData({ loading: true })

      try {
        const response = await api.getServices()
        const services = response.data || []
        
        // 添加模拟数据
        const mockServices = [
          {
            id: 1,
            name: '口腔检查',
            category: 'dental',
            icon: '/images/tooth.svg',
            price: 50,
            description: '全面的口腔健康检查，包括牙齿、牙龈、口腔黏膜等各项检查，及时发现口腔问题。',
            features: ['全面检查', '专业诊断', '健康建议'],
            duration: '30分钟'
          },
          {
            id: 2,
            name: '超声波洗牙',
            category: 'cleaning',
            icon: '/images/cleaning.svg',
            price: 120,
            description: '采用超声波技术深度清洁牙齿，去除牙菌斑和牙结石，预防牙周疾病。',
            features: ['深度清洁', '去除牙垢', '预防疾病'],
            duration: '45分钟'
          },
          {
            id: 3,
            name: '牙齿修复',
            category: 'repair',
            icon: '/images/medical.svg',
            price: 300,
            description: '针对牙齿缺损、变色等问题进行修复，恢复牙齿美观和功能。',
            features: ['美观修复', '功能恢复', '持久耐用'],
            duration: '60分钟'
          },
          {
            id: 4,
            name: '根管治疗',
            category: 'treatment',
            icon: '/images/clipboard.svg',
            price: 800,
            description: '针对牙髓炎、根尖周炎等疾病的专业治疗，保存患牙。',
            features: ['专业治疗', '保存患牙', '缓解疼痛'],
            duration: '90分钟'
          },
          {
            id: 5,
            name: '牙齿矫正',
            category: 'repair',
            icon: '/images/medical.svg',
            price: 5000,
            description: '专业的牙齿矫正服务，改善牙齿排列和咬合关系。',
            features: ['矫正排列', '改善咬合', '美观提升'],
            duration: '12个月'
          },
          {
            id: 6,
            name: '口腔护理',
            category: 'cleaning',
            icon: '/images/cleaning.svg',
            price: 80,
            description: '日常口腔护理指导，包括正确的刷牙方法和护理建议。',
            features: ['护理指导', '正确刷牙', '健康建议'],
            duration: '20分钟'
          }
        ]

        const allServices = [...services, ...mockServices]
        
        this.setData({
          services: allServices,
          filteredServices: allServices,
          loading: false
        })
      } catch (error) {
        console.error('加载服务失败:', error)
        this.setData({ loading: false })
      }
    },

    switchCategory(e) {
      const category = e.currentTarget.dataset.category
      this.setData({ activeCategory: category })
      
      if (category === 'all') {
        this.setData({
          filteredServices: this.data.services
        })
      } else {
        this.setData({
          filteredServices: this.data.services.filter(service => service.category === category)
        })
      }
    },

    navigateToServiceDetail(e) {
      const serviceId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/service-detail/service-detail?id=${serviceId}`
      })
    },

    makeAppointment() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      wx.navigateTo({
        url: '/pages/appointment/appointment'
      })
    }
  }
})