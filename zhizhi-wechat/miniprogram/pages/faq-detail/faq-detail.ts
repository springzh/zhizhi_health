// faq-detail.ts
import api from '../../utils/api'

Component({
  data: {
    faq: null,
    loading: true,
    expanded: true
  },

  lifetimes: {
    attached() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage.options || {}
      const faqId = options.id
      
      if (faqId) {
        this.loadFaqDetail(faqId)
      }
    }
  },

  methods: {
    async loadFaqDetail(faqId: string) {
      this.setData({ loading: true })

      try {
        const res = await api.getFaqDetail(parseInt(faqId))
        this.setData({
          faq: res.data,
          loading: false
        })
      } catch (error) {
        console.error('加载FAQ详情失败:', error)
        this.setData({ loading: false })
      }
    },

    toggleExpand() {
      this.setData({
        expanded: !this.data.expanded
      })
    },

    onShareAppMessage() {
      const faq = this.data.faq
      return {
        title: faq ? faq.question : '',
        path: `/pages/faq-detail/faq-detail?id=${faq ? faq.id : ''}`
      }
    }
  },
})