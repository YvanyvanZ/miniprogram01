// pages/observation-answer/index.js
Page({
  data: {
    currentDate: '',
    ganZhi: '',
    ganZhiColor: '#ffffff',
    ganZhiImage: '',
    canggan: [],
    aiInsight: '',
    observationText: '',
    isLoading: true,
    showAIResult: false
  },

  onLoad() {
    // 设置当前日期
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    this.setData({
      currentDate: `${year}年${month}月${day}日`
    });

    // 获取之前保存的观察记录
    const savedObservation = wx.getStorageSync('today_observation') || '';
    
    this.setData({
      observationText: savedObservation
    });
    
    // 获取干支和AI解读
    this.getDailyGanZhiAndInsight();
  },

  // 获取干支和AI解读
  getDailyGanZhiAndInsight() {
    const that = this;
    
    wx.showLoading({
      title: '正在解析侦查密码...',
    });
    
    wx.cloud.callFunction({
      name: 'getDailyCode',
      success: (res) => {
        console.log('获取干支数据:', res);
        const ganZhiData = res.result;
        
        that.setData({
          ganZhi: ganZhiData.ganZhi,
          ganZhiColor: ganZhiData.color,
          ganZhiImage: ganZhiData.imageUrl,
          canggan: ganZhiData.canggan || []
        });
        
        // 获取AI哲学启示
        that.getAIInsight(ganZhiData.ganZhi, ganZhiData.canggan);
      },
      fail: (err) => {
        console.error('获取干支失败:', err);
        wx.hideLoading();
        that.setData({ 
          isLoading: false,
          aiInsight: '获取侦查密码失败，请检查网络连接。'
        });
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      }
    });
  },

  // 调用AI解读
  getAIInsight(ganZhi, canggan) {
    const that = this;
    
    // 先隐藏loading，显示基础信息
    wx.hideLoading();
    that.setData({ 
      isLoading: false,
      showAIResult: true
    });
    
    // 模拟AI解读（实际应该调用云函数）
    setTimeout(() => {
      const presetInsights = {
        '甲子': `🌱 今日甲子，万物始新之象\n\n天干甲木，象征新生与成长，如春日嫩芽破土而出，充满生机与希望。地支子水，代表智慧与潜流，如深泉暗涌，蕴含无限可能。\n\n木水相生，提示今日宜开启新计划，种下希望的种子。藏干癸水，暗藏智慧源泉，提醒在行动中保持内心的清明与直觉。\n\n💫 相位共振：新生之力与深层智慧的交织，今日是启动与内省的最佳时机。`,
        
        '乙丑': `🌿 今日乙丑，柔韧中见坚持\n\n乙木如藤，柔韧而不失方向，在逆境中展现生命的韧性。丑土为基，稳定中蕴含力量，为成长提供坚实支撑。\n\n木土相协，教导我们在稳定中寻求成长，在坚持中保持灵活。藏干己、癸、辛，土水金交融，提示平衡务实、直觉与决断三方力量。\n\n💫 相位共振：柔韧与坚守的平衡艺术，今日需在变通中保持核心定力。`,
        
        '丙寅': `🔥 今日丙寅，热情启航之时\n\n丙火如日，散发温暖与光明，点燃行动的热情与创造力。寅木为基，提供成长的舞台与空间。\n\n火木相生，能量充沛，适合推进重要项目，展现领导才能。藏干甲、丙、戊，木火土齐聚，象征思想、行动与成果的完美循环。\n\n💫 相位共振：创造力与行动力的高峰，今日是展现才华、引领方向的良机。`,
        
        '丁卯': `🕯️ 今日丁卯，温和照亮前路\n\n丁火如烛，虽不耀眼却持久温暖，在细节处展现关怀与用心。卯木如花草，需要细心呵护才能绽放美丽。\n\n火木相映，提示关注人际关系与情感交流。藏干乙木，强调柔和的沟通方式与耐心的经营。\n\n💫 相位共振：细腻感知与温柔表达，今日宜在平凡中发现不平凡的美好。`
      };
      
      const insight = presetInsights[ganZhi] || 
        `📜 今日${ganZhi}，天地能量交汇\n\n藏干：${(canggan || []).join('、')}，多重元素交织，形成独特的能量场域。这提醒我们以开放的心态接纳各种可能性，在变化中寻找内在的平衡与智慧。\n\n每个干支组合都是宇宙的独特馈赠，今日的密码正等待你用独特的视角去解读和实践。\n\n💫 相位共振：多元能量的融合与转化，今日是学习适应与创造和谐的时机。`;
      
      that.setData({
        aiInsight: insight
      });
    }, 1500);
  },

  // 重新获取解读
  onRetry() {
    this.setData({
      showAIResult: false,
      isLoading: true
    });
    this.getDailyGanZhiAndInsight();
  },

  // 返回上一页
  onBack() {
    wx.navigateBack();
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: `今日侦查密码：${this.data.ganZhi}`,
      path: '/pages/observation-answer/index'
    };
  }
});