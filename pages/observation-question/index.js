// pages/observation-question/index.js

Page({
  data: {
    observationText: '',
    ganZhi: '',
    ganZhiImage: '',
    isLoading: true
  },

  onLoad() {
    const savedObservation = wx.getStorageSync('today_observation')
    if (savedObservation) {
      this.setData({
        observationText: savedObservation
      })
    }
    
    this.getDailyGanZhi()
  },

  getDailyGanZhi() {
    const that = this
    
    // 添加时间戳参数，避免云函数缓存
    const timestamp = new Date().getTime();
    
    wx.cloud.callFunction({
      name: 'getDailyCode',
      data: {
        timestamp: timestamp, // 添加时间戳
        forceRefresh: true    // 强制刷新
      },
      success: (res) => {
        console.log('✅ 云函数调用成功:', res)
        
        if (res.result && res.result.success && res.result.data) {
          const data = res.result.data
          
          console.log('📦 接收到的数据:', data)
          
          that.setData({
            ganZhi: data.ganZhi || '未知',
            ganZhiImage: data.imageUrl || '',
            isLoading: false
          })
        }
      },
      fail: (err) => {
        console.error('❌ 云函数调用失败:', err)
        that.setData({ isLoading: false })
      }
    })
  },

  onImageLoad(e) {
    console.log('✅ 图片加载成功')
  },

  onImageError(e) {
    console.error('❌ 图片加载失败:', e.detail)
  },

  onInputChange(e) {
    this.setData({
      observationText: e.detail.value
    })
  },

  onSubmit() {
    const { observationText } = this.data
    
    if (!observationText.trim()) {
      wx.showToast({
        title: '请输入观察内容',
        icon: 'none'
      })
      return
    }
    
    wx.setStorageSync('today_observation', observationText)
    
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/observation-answer/index'
          })
        }, 1500)
      }
    })
  }
})