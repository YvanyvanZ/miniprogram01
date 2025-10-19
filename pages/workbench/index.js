const app = getApp()
const db = wx.cloud.database()

// 六十甲子表
const ganzhiList = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

// 天干字典
const heavenlyStems = {
  '甲': { nature: '阳木', traits: ['生长', '开创', '领导'] },
  '乙': { nature: '阴木', traits: ['柔韧', '适应', '合作'] },
  '丙': { nature: '阳火', traits: ['热情', '光明', '行动'] },
  '丁': { nature: '阴火', traits: ['专注', '细腻', '文明'] },
  '戊': { nature: '阳土', traits: ['稳固', '承载', '诚信'] },
  '己': { nature: '阴土', traits: ['包容', '滋养', '灵活'] },
  '庚': { nature: '阳金', traits: ['变革', '锐利', '义气'] },
  '辛': { nature: '阴金', traits: ['精致', '贵气', '原则'] },
  '壬': { nature: '阳水', traits: ['智慧', '流通', '包容'] },
  '癸': { nature: '阴水', traits: ['润泽', '潜能', '谋略'] }
};

// 地支字典
const earthlyBranches = {
  '子': { nature: '阳水', traits: ['智慧', '开端', '潜藏'] },
  '丑': { nature: '阴土', traits: ['承载', '储藏', '坚韧'] },
  '寅': { nature: '阳木', traits: ['生长', '发动', '勇气'] },
  '卯': { nature: '阴木', traits: ['舒展', '柔韧', '合作'] },
  '辰': { nature: '阳土', traits: ['水库', '变化', '包容'] },
  '巳': { nature: '阴火', traits: ['光明', '变化', '智慧'] },
  '午': { nature: '阳火', traits: ['鼎盛', '热情', '光明'] },
  '未': { nature: '阴土', traits: ['木库', '滋养', '温和'] },
  '申': { nature: '阳金', traits: ['变革', '锋利', '义气'] },
  '酉': { nature: '阴金', traits: ['精致', '收敛', '原则'] },
  '戌': { nature: '阳土', traits: ['火库', '诚信', '稳重'] },
  '亥': { nature: '阴水', traits: ['润泽', '终结', '潜能'] }
};

// 谜题模板
const puzzleTemplates = [
  "今日{stemNature}与{branchNature}交汇，形成了怎样的能量场？留意身边人与事的互动，感受内在情绪的波动，记录下你的独特发现。",
  "{stem}{branch}日，{stemNature}与{branchNature}相遇。今日的能量特质会在哪些方面显现？观察自然现象或个人状态的变化，写下你的洞察。",
  "今天是{stem}{branch}日，{stemNature}和{branchNature}共同作用。这种组合会带来什么样的影响？关注沟通、决策或创造力的表现，记录你的体会。",
  "{stem}{branch}组合提示我们关注{stemTraits}和{branchTraits}的融合。今日的能量如何在你生活中展开？留意细微的征兆和感受。"
];

// 精确的干支计算函数 - 基于公历2024年1月22日（癸卯年乙丑月乙酉日）作为参考
function calculateGanzhi(date = new Date()) {
  // 参考点：公历2024年1月22日为 乙酉日（经过多个万年历验证）
  const referenceDate = new Date(2024, 0, 22); // 2024年1月22日
  const referenceGanzhi = '乙酉';
  const referenceGanzhiIndex = ganzhiList.indexOf(referenceGanzhi);
  
  console.log('参考点:', {
    日期: '2024年1月22日',
    干支: referenceGanzhi,
    索引: referenceGanzhiIndex
  });
  
  // 计算相差天数
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffTime = date.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / oneDayMs);
  
  console.log('天数差:', diffDays, '天');
  
  // 计算干支索引
  let ganzhiIndex = referenceGanzhiIndex + diffDays;
  
  // 处理索引边界
  if (ganzhiIndex >= ganzhiList.length) {
    ganzhiIndex = ganzhiIndex % ganzhiList.length;
  } else if (ganzhiIndex < 0) {
    ganzhiIndex = ganzhiList.length + (ganzhiIndex % ganzhiList.length);
  }
  
  // 确保索引在有效范围内
  ganzhiIndex = ganzhiIndex % ganzhiList.length;
  if (ganzhiIndex < 0) {
    ganzhiIndex += ganzhiList.length;
  }
  
  const result = ganzhiList[ganzhiIndex];
  
  console.log('计算过程:', {
    参考索引: referenceGanzhiIndex,
    天数差: diffDays,
    最终索引: ganzhiIndex,
    计算结果: result
  });
  
  return result;
}

// 测试函数：验证算法准确性
function testGanzhiAlgorithm() {
  const testDates = [
    { date: new Date(2024, 0, 22), expected: '乙酉', desc: '参考点' }, // 2024-01-22
    { date: new Date(2024, 0, 23), expected: '丙戌', desc: '参考点+1' }, // 2024-01-23
    { date: new Date(2024, 0, 24), expected: '丁亥', desc: '参考点+2' }, // 2024-01-24
    { date: new Date(2025, 8, 27), expected: '己亥', desc: '2025-09-27' }, // 昨天
    { date: new Date(2025, 8, 28), expected: '庚子', desc: '2025-09-28 今天' }, // 今天
    { date: new Date(2025, 8, 29), expected: '辛丑', desc: '2025-09-29 明天' }, // 明天
  ];
  
  console.log('=== 干支算法详细测试 ===');
  testDates.forEach(test => {
    const result = calculateGanzhi(test.date);
    const status = result === test.expected ? '✓' : '✗';
    console.log(`${status} ${test.desc}: ${test.date.toLocaleDateString()} -> ${result} (期望: ${test.expected})`);
    
    if (result !== test.expected) {
      console.log('  错误详情:', {
        日期: test.date.toISOString().split('T')[0],
        计算结果: result,
        期望结果: test.expected,
        差异: '需要调整算法'
      });
    }
  });
  console.log('=== 测试结束 ===');
}

// 生成今日的谜题文本
function generatePuzzleText(ganzhi) {
  const stem = ganzhi[0];
  const branch = ganzhi[1];
  const stemInfo = heavenlyStems[stem];
  const branchInfo = earthlyBranches[branch];

  if (!stemInfo || !branchInfo) {
    return '今日能量平稳，适合静心观察。';
  }

  const template = puzzleTemplates[Math.floor(Math.random() * puzzleTemplates.length)];

  let puzzle = template
    .replace(/{stem}/g, stem)
    .replace(/{branch}/g, branch)
    .replace(/{stemNature}/g, stemInfo.nature)
    .replace(/{branchNature}/g, branchInfo.nature)
    .replace(/{stemTraits}/g, stemInfo.traits.join('、'))
    .replace(/{branchTraits}/g, branchInfo.traits.join('、'));

  return puzzle;
}

// 生成思考方向文本
function generateThinkingDirection(ganzhi) {
  const stem = ganzhi[0];
  const branch = ganzhi[1];
  const stemInfo = heavenlyStems[stem];
  const branchInfo = earthlyBranches[branch];

  if (!stemInfo || !branchInfo) {
    return '思考方向：保持觉知，观察今日的能量流动。';
  }

  return `思考方向：从${stem}${branch}的特性出发进行观察`;
}

Page({
  data: {
    currentDate: '',
    currentGanzhi: '',
    puzzleText: '',
    thinkingDirection: '',
    showAnswerSection: false,
    isRefreshing: false,
    
    // 新增AI教练数据
    aiCoach: {
      isVisible: false,
      isMinimized: false,
      hasNewMessage: true,
      currentMessage: '',
      iconPath: '', // 可以后面对接图片路径
      messages: [
        "欢迎来到能量侦探工作台！今天的天干地支组合很有特点，要不要听听我的观察建议？",
        "注意到你还没有记录今天的观察笔记呢，现在正是感受能量流动的好时机～",
        "今天的干支能量会在沟通和决策方面有所体现，记得留意身边的小细节哦",
        "记录笔记时，可以从情绪、人际、身体感受三个角度入手，需要我帮你梳理吗？"
      ],
      currentMessageIndex: 0
    }
  },

  onLoad: function (options) {
    console.log('=== 页面加载，开始干支计算 ===');
    console.log('当前时间:', new Date().toString());
    
    // 运行详细测试
    testGanzhiAlgorithm();
    this.calculateDailyData();
    
    // 初始化AI教练 - 延迟显示欢迎语
    this.initAICoach();
  },

  onShow: function () {
    this.checkAnswerSection();
    // 每次显示页面时检查是否需要触发教练
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 9 && hours <= 11) {
      this.triggerCoachByBehavior('morning_visit');
    } else if (hours >= 14 && hours <= 17) {
      this.triggerCoachByBehavior('afternoon_visit');
    } else if (hours >= 20) {
      this.triggerCoachByBehavior('evening_visit');
    }
  },

  // 计算每日数据
  calculateDailyData: function () {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    
    // 计算今日干支
    const ganzhi = calculateGanzhi(today);
    
    console.log('=== 今日干支最终结果 ===');
    console.log('日期:', formattedDate);
    console.log('计算结果:', ganzhi);
    console.log('期望结果: 庚子');
    console.log('是否正确:', ganzhi === '庚子' ? '✓ 正确' : '✗ 错误');
    
    const puzzle = generatePuzzleText(ganzhi);
    const thinkingDir = generateThinkingDirection(ganzhi);

    this.setData({
      currentDate: formattedDate,
      currentGanzhi: ganzhi + '日',
      puzzleText: puzzle,
      thinkingDirection: thinkingDir
    });

    this.checkAnswerSection();
  },

  // 检查是否显示答案区域（23:30后显示）
  checkAnswerSection: function () {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    const shouldShowAnswer = (hours > 23) || (hours === 23 && minutes >= 30);
    
    this.setData({
      showAnswerSection: shouldShowAnswer
    });
    
    // 如果答案已公布，触发教练提醒
    if (shouldShowAnswer) {
      this.triggerCoachByBehavior('answer_released');
    }
  },
  // 返回首页
  goToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 处理下拉刷新
  handleRefresh: function () {
    this.setData({
      isRefreshing: true
    });

    setTimeout(() => {
      this.calculateDailyData();
      this.setData({
        isRefreshing: false
      });
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 修改 handleRecordNotePress 函数 - 创建新笔记
  handleRecordNotePress: function() {
    console.log('点击记录笔记按钮 - 创建新笔记');
    // 获取今天的日期（简单方法）
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    
    // 根据你的截图，干支是"癸丑日"
    const ganzhi = '癸丑日';
    // 触发教练消息
    this.triggerCoachByBehavior('before_record');
    
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/notes/detail/index?action=create'
      });
    }, 500);
  },

  // 处理课程入口点击 - 修改为实际跳转
  handleCoursePress: function() {
    console.log('点击课程按钮');
    wx.navigateTo({
      url: '/pages/workbench/index'
    });
  },

  // 处理AI教练入口点击
  handleAICoachPress: function() {
    console.log('点击AI教练按钮');
    wx.navigateTo({
      url: '/pages/aichat/index'
    });
  },

  // 处理历史谜题入口点击
  handleHistoryPress: function () {
    console.log('点击历史谜题按钮');
    wx.navigateTo({
      url: '/pages/my-notes/index',
      icon: 'none'
    });
  },

  // 处理个人资料按钮点击
  handleProfilePress: function () {
    console.log('点击个人资料按钮');
    wx.navigateTo({
      url: '/pages/profile/index'
    });
  },

  // 处理通知按钮点击
  handleNotificationPress: function () {
    console.log('点击通知按钮');
    wx.showToast({
      title: '通知功能开发中',
      icon: 'none'
    });
  },

  // ========== AI教练相关函数 ==========
  
  // 初始化AI教练
  initAICoach: function() {
    const that = this;
    
    // 延迟3秒显示欢迎语
    setTimeout(() => {
      that.showCoachMessage(0); // 显示第一条欢迎消息
    }, 3000);
  },

  // 显示教练消息
  showCoachMessage: function(index) {
    const messages = this.data.aiCoach.messages;
    if (index >= messages.length) return;
    
    this.setData({
      'aiCoach.currentMessage': messages[index],
      'aiCoach.isVisible': true,
      'aiCoach.hasNewMessage': true,
      'aiCoach.currentMessageIndex': index
    });
  },

  // 切换教练聊天框
  toggleCoachChat: function() {
    const currentState = this.data.aiCoach.isVisible;
    this.setData({
      'aiCoach.isVisible': !currentState,
      'aiCoach.hasNewMessage': false
    });
  },

  // 处理教练响应
  handleCoachResponse: function(e) {
    const response = e.currentTarget.dataset.response;
    
    if (response === 'positive') {
      // 用户点击"好的"
      wx.showToast({
        title: '开始记录吧！',
        icon: 'success'
      });
      
      const currentMessage = this.data.aiCoach.currentMessage;
      
      // 根据当前消息内容执行不同操作
      if (currentMessage.includes('笔记') || currentMessage.includes('记录')) {
        setTimeout(() => {
          this.handleRecordNotePress();
        }, 1000);
      } else if (currentMessage.includes('解析') || currentMessage.includes('答案')) {
        // 滚动到答案区域
        if (this.data.showAnswerSection) {
          wx.pageScrollTo({
            selector: '.answerSection',
            duration: 300
          });
        }
      }
    } else {
      // 用户点击"稍后"
      wx.showToast({
        title: '稍后提醒你',
        icon: 'none'
      });
    }
    
    // 隐藏聊天框
    this.setData({
      'aiCoach.isVisible': false
    });
    
    // 5分钟后再次提醒
    setTimeout(() => {
      this.showNextCoachMessage();
    }, 5 * 60 * 1000);
  },

  // 显示下一条教练消息
  showNextCoachMessage: function() {
    const currentIndex = this.data.aiCoach.currentMessageIndex;
    const messages = this.data.aiCoach.messages;
    const nextIndex = (currentIndex + 1) % messages.length;
    
    this.showCoachMessage(nextIndex);
  },

  // 基于用户行为触发教练消息
  triggerCoachByBehavior: function(behavior) {
    const behaviorMessages = {
      'morning_visit': '早安！今天的天干地支能量已经开始流动，记得留意观察哦～',
      'afternoon_visit': '下午好！今天的能量观察有什么新发现吗？',
      'evening_visit': '晚上好！是时候回顾今天的能量流动了。',
      'before_record': '记录笔记前，不妨先静心感受一下今天的能量流动～',
      'after_record': '很棒的能量观察！继续保持这份觉察。',
      'answer_released': '今天的能量谜题答案已经公布啦！快来看看专业解析吧～',
      'first_visit': '欢迎来到能量侦探工作台！让我们一起探索今天的干支能量奥秘。'
    };
    
    if (behaviorMessages[behavior]) {
      this.setData({
        'aiCoach.currentMessage': behaviorMessages[behavior],
        'aiCoach.isVisible': true,
        'aiCoach.hasNewMessage': true
      });
      
      // 更新当前消息索引
      this.setData({
        'aiCoach.currentMessageIndex': -1 // 特殊行为消息
      });
    }
  }
});