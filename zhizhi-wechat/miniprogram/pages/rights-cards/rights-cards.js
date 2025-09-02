// rights-cards.js
// 获取应用实例
const app = getApp()
import api from '../../utils/api'

Component({
  data: {
    myCards: [],
    availableCards: [],
    loading: true
  },

  lifetimes: {
    attached() {
      this.loadCards()
    }
  },

  methods: {
    async loadCards() {
      this.setData({ loading: true })

      try {
        // 模拟我的权益卡数据
        const myCards = [
          {
            id: 1,
            name: '健康守护卡',
            type: '年度会员',
            status: 'active',
            statusText: '使用中',
            benefits: ['免费洗牙2次', '口腔检查4次', '治疗费8折', '优先预约'],
            validUntil: '2024-12-31'
          },
          {
            id: 2,
            name: '家庭关爱卡',
            type: '家庭会员',
            status: 'expired',
            statusText: '已过期',
            benefits: ['全家口腔护理', '儿童窝沟封闭', '正畸咨询', '定期回访'],
            validUntil: '2024-06-30'
          }
        ]

        // 模拟可购买的权益卡数据
        const availableCards = [
          {
            id: 3,
            name: '基础护理卡',
            description: '适合日常口腔护理，享受基础服务优惠',
            image: '/images/card-basic.png',
            price: 299,
            originalPrice: 399,
            discount: 7.5,
            features: ['洗牙优惠', '检查免费', '补牙折扣', '咨询服务']
          },
          {
            id: 4,
            name: '尊享VIP卡',
            description: '高端会员权益，享受全方位口腔健康服务',
            image: '/images/card-vip.png',
            price: 1299,
            originalPrice: 1599,
            discount: 8.1,
            features: ['无限洗牙', '专人服务', '治疗折扣', '紧急处理']
          },
          {
            id: 5,
            name: '儿童呵护卡',
            description: '专为儿童设计的口腔健康权益卡',
            image: '/images/card-child.png',
            price: 599,
            originalPrice: 799,
            discount: 7.5,
            features: ['窝沟封闭', '涂氟防龋', '正畸咨询', '成长跟踪']
          },
          {
            id: 6,
            name: '老年关爱卡',
            description: '关注老年人口腔健康的专属权益卡',
            image: '/images/card-elderly.png',
            price: 399,
            originalPrice: 499,
            discount: 8.0,
            features: ['义齿维护', '定期检查', '健康讲座', '上门服务']
          }
        ]

        this.setData({
          myCards,
          availableCards,
          loading: false
        })
      } catch (error) {
        console.error('加载权益卡失败:', error)
        this.setData({ loading: false })
      }
    },

    viewCardDetail(e) {
      const cardId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/card-detail/card-detail?id=${cardId}`
      })
    },

    useCard(e) {
      const cardId = e.currentTarget.dataset.id
      const card = this.data.myCards.find(c => c.id === cardId)
      
      wx.showModal({
        title: '使用权益卡',
        content: `确定要使用${card.name}的权益吗？`,
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '权益卡已激活',
              icon: 'success'
            })
          }
        }
      })
    },

    renewCard(e) {
      const cardId = e.currentTarget.dataset.id
      const card = this.data.myCards.find(c => c.id === cardId)
      
      wx.showModal({
        title: '续费权益卡',
        content: `确定要续费${card.name}吗？`,
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/payment/payment?type=card&id=${cardId}`
            })
          }
        }
      })
    },

    buyCard(e) {
      const cardId = e.currentTarget.dataset.id
      const card = this.data.availableCards.find(c => c.id === cardId)
      
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      wx.showModal({
        title: '购买权益卡',
        content: `确定要购买${card.name}吗？价格：¥${card.price}`,
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/payment/payment?type=card&id=${cardId}`
            })
          }
        }
      })
    },

    navigateToAppointment() {
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