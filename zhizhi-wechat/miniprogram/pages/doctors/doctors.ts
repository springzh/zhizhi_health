// doctors.ts
// 获取应用实例
const app = getApp<IAppOption>()
import api from '../../utils/api'

Component({
  data: {
    doctors: [],
    loading: false, // 改为false，避免初始化时被阻止
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
      console.log('医生页面已加载')
      this.loadDoctors()
    }
  },

  methods: {
    async loadDoctors(refresh = false) {
      console.log('开始加载医生列表...', { refresh, page: this.data.page, loading: this.data.loading, hasMore: this.data.hasMore })
      
      if (refresh) {
        this.setData({
          page: 1,
          doctors: [],
          hasMore: true
        })
      }

      // 如果正在加载，则返回（避免重复请求）
      if (this.data.loading) return
      // 如果没有更多数据且不是刷新，则返回
      if (!this.data.hasMore && !refresh) return

      this.setData({ loading: true })

      try {
        const params = {
          page: this.data.page,
          limit: this.data.limit,
          sort: this.data.sortBy,
          q: this.data.searchQuery
        }

        console.log('请求医生列表参数:', params)
        const res = await api.getDoctors(params)
        const doctors = res.data || []
        
        console.log('获取到医生数据:', doctors.length, '条')

        this.setData({
          doctors: refresh ? doctors : [...this.data.doctors, ...doctors],
          hasMore: doctors.length === this.data.limit,
          loading: false,
          page: this.data.page + 1
        })
        
        console.log('医生列表加载完成')
      } catch (error) {
        console.error('加载医生列表失败:', error)
        wx.showToast({
          title: '加载医生列表失败',
          icon: 'none',
          duration: 2000
        })
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