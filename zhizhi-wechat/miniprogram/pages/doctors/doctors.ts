// doctors.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    doctors: [],
    loading: true,
    hasMore: true,
    page: 1,
    limit: 10,
    searchQuery: '',
    sortBy: 'rating',
    sortText: '评分最高',
    sortOptions: [
      { value: 'rating', label: '评分最高' },
      { value: 'experience', label: '经验最丰富' },
      { value: 'name', label: '姓名排序' }
    ],
    showSortModal: false
  },

  lifetimes: {
    attached() {
      this.loadDoctors()
    }
  },

  methods: {
    async loadDoctors(refresh = false) {
      if (refresh) {
        this.setData({
          page: 1,
          doctors: [],
          hasMore: true
        })
      }

      if (!this.data.hasMore || this.data.loading) return

      this.setData({ loading: true })

      try {
        const params = {
          page: this.data.page,
          limit: this.data.limit,
          sort: this.data.sortBy,
          q: this.data.searchQuery
        }

        const res = await api.getDoctors(params)
        const doctors = res.data || []

        this.setData({
          doctors: refresh ? doctors : [...this.data.doctors, ...doctors],
          hasMore: doctors.length === this.data.limit,
          loading: false,
          page: this.data.page + 1
        })
      } catch (error) {
        console.error('加载医生列表失败:', error)
        this.setData({ loading: false })
      }
    },

    onSearchInput(e: any) {
      this.setData({
        searchQuery: e.detail.value
      })
    },

    onSearch() {
      this.loadDoctors(true)
    },

    onClearSearch() {
      this.setData({
        searchQuery: ''
      }, () => {
        this.loadDoctors(true)
      })
    },

    showSortOptions() {
      this.setData({
        showSortModal: true
      })
    },

    hideSortOptions() {
      this.setData({
        showSortModal: false
      })
    },

    selectSort(e: any) {
      const sortBy = e.currentTarget.dataset.value
      const sortOption = this.data.sortOptions.find(o => o.value === sortBy)
      this.setData({
        sortBy,
        sortText: sortOption ? sortOption.label : '评分最高',
        showSortModal: false
      }, () => {
        this.loadDoctors(true)
      })
    },

    navigateToDoctorDetail(e: any) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/doctor-detail/doctor-detail?id=${id}`
      })
    },

    onReachBottom() {
      this.loadDoctors()
    },

    onPullDownRefresh() {
      this.loadDoctors(true)
      wx.stopPullDownRefresh()
    }
  },
})