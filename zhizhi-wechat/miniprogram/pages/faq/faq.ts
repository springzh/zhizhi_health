// faq.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    categories: [],
    faqs: [],
    popularFaqs: [],
    loading: true,
    activeCategory: '',
    searchQuery: '',
    showSearch: false,
    expandedFaqs: new Set()
  },

  lifetimes: {
    attached() {
      this.loadData()
    }
  },

  methods: {
    async loadData() {
      this.setData({ loading: true })

      try {
        const [categories, popularFaqs] = await Promise.all([
          api.getFaqCategories(),
          api.getPopularFaqs()
        ])

        this.setData({
          categories: categories.data || [],
          popularFaqs: popularFaqs.data || [],
          loading: false
        })

        // 加载第一个分类的FAQ
        if (categories.data && categories.data.length > 0) {
          this.selectCategory(categories.data[0])
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        this.setData({ loading: false })
      }
    },

    async selectCategory(category: any) {
      this.setData({
        activeCategory: category,
        loading: true
      })

      try {
        const res = await api.getFaqs({ category: category })
        this.setData({
          faqs: res.data || [],
          loading: false,
          expandedFaqs: new Set()
        })
      } catch (error) {
        console.error('加载FAQ失败:', error)
        this.setData({ loading: false })
      }
    },

    toggleSearch() {
      this.setData({
        showSearch: !this.data.showSearch,
        searchQuery: ''
      })
    },

    onSearchInput(e: any) {
      this.setData({
        searchQuery: e.detail.value
      })
    },

    async onSearch() {
      if (!this.data.searchQuery.trim()) {
        this.setData({
          faqs: []
        })
        return
      }

      this.setData({ loading: true })

      try {
        const res = await api.getFaqs({ q: this.data.searchQuery })
        this.setData({
          faqs: res.data || [],
          loading: false,
          activeCategory: '',
          expandedFaqs: new Set()
        })
      } catch (error) {
        console.error('搜索失败:', error)
        this.setData({ loading: false })
      }
    },

    toggleFaq(e: any) {
      const faqId = e.currentTarget.dataset.id
      const expandedFaqs = new Set(this.data.expandedFaqs)
      
      if (expandedFaqs.has(faqId)) {
        expandedFaqs.delete(faqId)
      } else {
        expandedFaqs.add(faqId)
      }
      
      this.setData({ expandedFaqs })
    },

    navigateToFaqDetail(e: any) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/faq-detail/faq-detail?id=${id}`
      })
    },

    async submitConsultation() {
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      wx.showModal({
        title: '在线咨询',
        content: '请描述您的问题，我们的医生会尽快回复您',
        editable: true,
        placeholderText: '请输入您的问题...',
        success: (res) => {
          if (res.confirm && res.content) {
            this.createConsultation(res.content)
          }
        }
      })
    },

    async createConsultation(content: string) {
      try {
        // 这里需要实现咨询提交API
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
      } catch (error) {
        wx.showToast({
          title: '提交失败',
          icon: 'error'
        })
      }
    },

    onPullDownRefresh() {
      this.loadData()
      wx.stopPullDownRefresh()
    }
  },
})