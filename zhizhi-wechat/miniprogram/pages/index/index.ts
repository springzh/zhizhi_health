// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    loading: true,
    recommendedDoctors: [],
    services: [],
    popularFaqs: [],
    banners: [
      {
        image: '/images/banner1.jpg',
        title: '专业口腔护理',
        subtitle: '呵护您的牙齿健康'
      },
      {
        image: '/images/banner2.jpg',
        title: '在线预约',
        subtitle: '便捷快速预约专家'
      }
    ],
    serviceCategories: [
      {
        id: 'dental',
        name: '牙科服务',
        icon: '/icons/dental.png',
        color: '#1E88E5'
      },
      {
        id: 'cell',
        name: '细胞治疗',
        icon: '/icons/cell.png',
        color: '#43A047'
      },
      {
        id: 'membership',
        name: '会员服务',
        icon: '/icons/membership.png',
        color: '#FF6F00'
      }
    ]
  },

  lifetimes: {
    attached() {
      this.loadData()
    }
  },

  methods: {
    async loadData() {
      console.log('开始加载首页数据...')
      this.setData({ loading: true })
      
      try {
        console.log('正在请求API数据...')
        const [doctors, services, faqs] = await Promise.all([
          api.getDoctors({ limit: 3, sort: 'rating' }),
          api.getServices(),
          api.getPopularFaqs()
        ])

        console.log('API响应数据:', { doctors, services, faqs })
        
        this.setData({
          recommendedDoctors: doctors.data || [],
          services: services.data || [],
          popularFaqs: faqs.data || [],
          loading: false
        })
        
        console.log('首页数据加载完成')
      } catch (error) {
        console.error('加载数据失败:', error)
        wx.showToast({
          title: '加载失败，请检查网络连接',
          icon: 'none',
          duration: 3000
        })
        this.setData({ loading: false })
      }
    },

    navigateToDoctorList() {
      wx.navigateTo({
        url: '/pages/doctors/doctors'
      })
    },

    navigateToDoctorDetail(e: any) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/doctor-detail/doctor-detail?id=${id}`
      })
    },

    navigateToServiceList() {
      wx.navigateTo({
        url: '/pages/services/services'
      })
    },

    navigateToFaq() {
      wx.navigateTo({
        url: '/pages/faq/faq'
      })
    },

    navigateToFaqDetail(e: any) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/faq-detail/faq-detail?id=${id}`
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
    },

    onRefresh() {
      this.loadData()
    }
  },
})
