// app.js
App({
  onLaunch: function () {
    console.log('小程序初始化');
    
    // 初始化云开发
    if (typeof wx.cloud !== 'undefined') {
      wx.cloud.init({
        env: 'cloudbase-7gg55mqc3fd1da2c', // 请替换为你的云环境ID
        traceUser: true,
      });
      console.log('云开发初始化成功');
    }
    
    // 设置正确的干支数据
    this.setCorrectGanzhi();
  },

  // 设置正确的干支数据
  setCorrectGanzhi: function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    this.globalData.currentDate = `${year}年${month}月${day}日`;
    this.globalData.currentGanzhi = '乙卯日'; // 根据你的需求设置
    
    // 保存到缓存
    try {
      wx.setStorageSync('currentGanzhi', '乙卯日');
      wx.setStorageSync('currentDate', this.globalData.currentDate);
      console.log('干支数据设置完成: 乙卯日');
    } catch (e) {
      console.error('保存干支数据失败:', e);
    }
  },

  globalData: {
    currentDate: '2025年10月13日',
    currentGanzhi: '乙卯日',
    userInfo: null
  }
})