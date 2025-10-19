// pages/index/index.js - 优化版本
Page({
  data: {
    currentCardIndex: 1,  // 默认显示第二个卡片（觉察记录）
    bgMoveX: 0,
    bgMoveY: 0,
    toolCards: [
      {
        id: 2,
        icon: "🔍",
        poster: "/images/sample2.jpg",
        title: "每日观察", 
        description: "所有宏大的洞察...\n..积累星光数据",
        status: "available",
        available: true,
        useImage: true
      },
      {
        id: 1,
        icon: "🎨",
        poster: "/images/sample1.jpg",
        title: "绘制云图",
        description: "通过七大参数..终极工具\n航行日志我们正在..",
        status: "developing",
        available: false,
        useImage: true
      },
      {
        id: 3,
        icon: "🚀", 
        poster: "/images/sample3.jpg",
        title: "知行合一",
        description: "NLP教练式陪伴\n将觉察转化为行动",
        status: "developing",
        available: false,
        useImage: true
      },
      {
        id: 4,
        icon: "🌌",
        poster: "/images/sample4.jpg",
        title: "观复星云",
        description: "深度服务体系\n人生智慧的升华",
        status: "future", 
        available: false,
        useImage: true
      }
    ]
  },

  /**
   * 监听设备方向变化（重力感应）
   */
  onDeviceOrientationChange: function(res) {
    const { gamma, beta } = res;  // gamma: 左右倾斜, beta: 前后倾斜
    
    // 限制移动范围在 -15px 到 15px 之间，创造柔和效果
    const moveX = Math.max(-15, Math.min(15, gamma * 0.2));
    const moveY = Math.max(-15, Math.min(15, beta * 0.1));
    
    this.setData({
      bgMoveX: moveX,
      bgMoveY: moveY
    });
  },

  /**
   * 卡片切换事件
   */
  onCardChange: function(event) {
    const currentIndex = event.detail.current;
    console.log('切换到卡片:', currentIndex, this.data.toolCards[currentIndex].title);
    this.setData({
      currentCardIndex: currentIndex
    });
  },

  /**
   * 卡片点击事件
   */
  onCardTap: function(event) {
    const index = event.currentTarget.dataset.index;
    const card = this.data.toolCards[index];
    
    console.log('点击卡片:', card.title, '可用状态:', card.available);
    
    if (card.available) {
      wx.showLoading({
        title: '进入工作台...',
        mask: true
      });
      setTimeout(() => {
        wx.hideLoading();
        wx.reLaunch({
          url: '/pages/observation-question/index'
        });
      }, 600);
    } else {
      let title = '功能预告';
      let content = '';
      
      if (card.status === 'developing') {
        content = `"${card.title}"功能正在精心开发中\n预计近期上线，敬请期待！✨`;
      } else if (card.status === 'future') {
        content = `"${card.title}"是我们对未来的美好愿景\n将在后续版本中与您见面！🌟`;
      }
      
      wx.showModal({
        title: title,
        content: content,
        confirmText: '期待中',
        showCancel: false,
        confirmColor: '#667eea'
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('🌟 星图大厅加载完成');
    
    // 开启设备方向监听（重力感应）
    if (wx.onDeviceOrientationChange) {
      wx.onDeviceOrientationChange(this.onDeviceOrientationChange);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 关闭设备方向监听
    if (wx.offDeviceOrientationChange) {
      wx.offDeviceOrientationChange(this.onDeviceOrientationChange);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面隐藏时关闭监听以节省资源
    if (wx.offDeviceOrientationChange) {
      wx.offDeviceOrientationChange(this.onDeviceOrientationChange);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时重新开启监听
    if (wx.onDeviceOrientationChange) {
      wx.onDeviceOrientationChange(this.onDeviceOrientationChange);
    }
  },

  /**
   * 用户下拉刷新
   */
  onPullDownRefresh: function () {
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  }
});