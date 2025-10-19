// pages/ai/chat/index.js
Page({
  data: {
    messageText: '',
    messages: [],
    isTyping: false,
    scrollTop: 0,
    conversationId: null,
    currentTitle: '',
    // 记录各层回复的使用次数，用于轮换
    replyCounters: {
      greeting: 0,
      internet: 0,
      emotion: {},
      humor: 0
    }
  },

  onLoad(options) {
    if (options.conversationId) {
      this.loadConversation(options.conversationId);
    } else {
      this.startNewConversation();
    }
  },

  startNewConversation() {
    this.setData({
      conversationId: 'conv_' + Date.now(),
      messages: [],
      currentTitle: '新对话',
      replyCounters: {
        greeting: 0,
        internet: 0,
        emotion: {},
        humor: 0
      }
    });
  },

  loadConversation(conversationId) {
    const conversations = wx.getStorageSync('ai_conversations') || [];
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      const messages = wx.getStorageSync(`messages_${conversationId}`) || [];
      this.setData({
        conversationId,
        messages,
        currentTitle: conversation.title
      });
      this.scrollToBottom();
    }
  },

  onInputChange(e) {
    this.setData({
      messageText: e.detail.value
    });
  },

  onKeyboardHeightChange(e) {
    if (e.detail.height > 0) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 300);
    }
  },

  handleBack() {
    wx.navigateBack();
  },

  handleHistory() {
    wx.navigateTo({
      url: '/pages/ai/history/index'
    });
  },

  handleInputSend() {
    if (!this.data.messageText.trim()) return;
    this.sendMessage(this.data.messageText.trim());
  },

  sendMessage(text) {
    const userMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...this.data.messages, userMessage];
    this.setData({
      messages: newMessages,
      messageText: '',
      isTyping: true
    });

    this.saveMessages(newMessages);
    this.scrollToBottom();

    // 智能回复
    setTimeout(() => {
      const aiResponse = this.generateLayeredResponse(text, newMessages);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      const updatedMessages = [...newMessages, aiMessage];
      this.setData({
        messages: updatedMessages,
        isTyping: false
      });

      this.saveMessages(updatedMessages);
      this.scrollToBottom();

      // 如果是第一条消息，生成对话标题
      if (newMessages.length === 1) {
        this.generateConversationTitle(text, updatedMessages);
      }
    }, 800 + Math.random() * 400);
  },

  // 基于V1.1的四层对话系统
  generateLayeredResponse(userMessage, messageHistory) {
    const message = userMessage.toLowerCase().trim();
    
    // 获取上下文
    const lastAIMessage = messageHistory
      .filter(msg => msg.sender === 'ai')
      .pop();

    // 第一层：日常问候
    if (this.isGreeting(message)) {
      return this.getGreetingResponse();
    }

    // 第二层：次元化用语（网络流行语）
    if (this.isInternetSlang(message)) {
      return this.getInternetSlangResponse(message);
    }

    // 第三层：核心情绪教练
    const emotionResponse = this.getEmotionResponse(message, lastAIMessage);
    if (emotionResponse) {
      return emotionResponse;
    }

    // 第四层：幽默兜底
    return this.getHumorResponse(message);
  },

  // 第一层：日常问候检测
  isGreeting(message) {
    const greetings = ['你好', '嗨', '在吗', '早上好', '哈喽', 'hello', 'hi', '您好'];
    return greetings.some(greeting => message.includes(greeting));
  },

  // 第一层：日常问候回复
  getGreetingResponse() {
    const responses = [
      '你好呀，我是柔柔熊，今天有什么想和我分享的吗？',
      '嗨！看到你来了，真好。此刻心情如何？',
      '（微笑）我在这里呢，随时准备倾听。'
    ];
    
    const index = this.data.replyCounters.greeting % responses.length;
    this.setData({
      'replyCounters.greeting': this.data.replyCounters.greeting + 1
    });
    
    return responses[index];
  },

  // 第二层：次元化用语检测
  isInternetSlang(message) {
    const slangs = ['emo', '裂开', '破防', '社死', '尴尬', '绝绝子', 'yyds', '哈哈哈哈', '23333'];
    return slangs.some(slang => message.includes(slang));
  },

  // 第二层：次元化用语回复
  getInternetSlangResponse(message) {
    let responses = [];
    
    if (message.includes('emo') || message.includes('裂开') || message.includes('破防')) {
      responses = [
        '（递上虚拟纸巾）来，我们先照顾好这个‘emo’/‘裂开’/‘破防’的小伙伴。它是因为什么事来的呀？',
        '捕捉到一颗需要充电的星星~ 这种时候，做什么事能让你感觉‘被接住’一点呢？'
      ];
    } else if (message.includes('社死') || message.includes('尴尬')) {
      responses = [
        '（做个鬼脸）嘘——让我们用‘观察者’视角远远看看那个场景，会不会觉得当时的自己有点可爱？',
        '欢迎体验‘人类社死模拟器’！现在剧情结束了，你从主角变回观察者，感觉有什么不同吗？'
      ];
    } else if (message.includes('绝绝子') || message.includes('yyds')) {
      responses = [
        '哇，‘绝绝子’！是遇到了什么让你眼睛一亮的人或事吗？快分享一下这份能量！',
        '看来你发现了生命中的‘YYDS’！它让你感觉……充满力量？还是内心特别满足？'
      ];
    } else {
      responses = [
        '（好奇地偏头）我收到了一串神秘的宇宙信号... 能帮我翻译一下，它在你心里代表着什么感觉吗？',
        '检测到一团未定义的能量云团~ 它更接近「好奇」「困惑」还是「放空」呢？'
      ];
    }
    
    const index = this.data.replyCounters.internet % responses.length;
    this.setData({
      'replyCounters.internet': this.data.replyCounters.internet + 1
    });
    
    return responses[index];
  },

  // 第三层：核心情绪教练
  getEmotionResponse(message, lastAIMessage) {
    // 情绪关键词映射
    const emotionKeywords = {
      '无聊': ['无聊', '没意思', '无事可做'],
      '压力': ['压力', '好累', '累', '疲惫', '喘不过气'],
      '迷茫': ['迷茫', '不知道', '困惑', '不清楚'],
      '自卑': ['自卑', '觉得自己不行', '不如别人'],
      '快乐': ['快乐', '开心', '高兴', '幸福', '很好']
    };

    // 找到匹配的情绪
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return this.getEmotionCoachResponse(emotion, message, lastAIMessage);
      }
    }
    
    return null;
  },

  // 第三层：具体情绪教练回复
  getEmotionCoachResponse(emotion, message, lastAIMessage) {
    const responses = {
      '无聊': [
        '感觉有点无聊呀……如果这份‘无聊’有颜色或形状，你觉得它会是什么样子的？',
        '这或许是你的「心之所向」在提醒你，是时候为生活寻找一些新的‘指向’了。'
      ],
      '压力': [
        '我感受到了你提到的‘压力’。这种压力更像是一座山压在身上，还是像被很多根绳子往不同方向拉扯呢？',
        '这常常和「联动之仪」的失衡有关。是哪些不同的事情在同时消耗你的能量呢？'
      ],
      '迷茫': [
        '正处在迷雾中，看不清方向的感觉确实不太好受。在这片迷雾里，有没有哪怕一个非常微小的、让你感觉‘对劲’的东西？',
        '绘制「人生云图」正是为了帮我们拨开迷雾。我们可以先从找到你此刻清晰的「立足之境」开始。'
      ],
      '自卑': [
        '‘自卑’那个声音又出来说话了吗？如果它现在正站在你身边，你想对它说些什么？',
        '当我们感到‘自卑’，往往是拿自己的内在和别人的外在比较了。你真正渴望拥有的，是什么特质呢？'
      ],
      '快乐': [
        '真为你感到高兴！是发生了什么事，还是内心突然涌起了某种感觉，让这份‘快乐’出现了？',
        '记住这份美好的感觉，它就是「心之所向」上最亮的灯塔。把它记下来吧！'
      ]
    };

    // 初始化情绪计数器
    if (!this.data.replyCounters.emotion[emotion]) {
      this.setData({
        [`replyCounters.emotion.${emotion}`]: 0
      });
    }

    const emotionResponses = responses[emotion] || responses['无聊'];
    const index = this.data.replyCounters.emotion[emotion] % emotionResponses.length;
    
    this.setData({
      [`replyCounters.emotion.${emotion}`]: this.data.replyCounters.emotion[emotion] + 1
    });
    
    return emotionResponses[index];
  },

  // 第四层：幽默兜底
  getHumorResponse(message) {
    let responses = [];
    
    // 根据输入类型选择不同的幽默回复
    if (message === '?' || message === '。。。' || message === '啊啊啊' || message.length === 1) {
      responses = [
        '（好奇地偏头）我收到了一串神秘的宇宙信号... 能帮我翻译一下，它在你心里代表着什么感觉吗？',
        '检测到一团未定义的能量云团~ 它更接近「好奇」「困惑」还是「放空」呢？'
      ];
    } else if (message.includes('随便') || message.includes('不知道')) {
      responses = [
        '‘随便’可是个有趣的答案，它有时藏着我们最真实的想法。那在‘随便’的海洋里，你第一个看到的小岛是什么？',
        '看来今天想扮演一个谜语人呢~ 那我们来玩个游戏吧，用三个词形容你现在的状态，怎么样？'
      ];
    } else if (this.isRandomTyping(message)) {
      responses = [
        '（眨眨眼）这是某种观察手抖的新行为艺术吗？😂',
        '哇，这是你的星球特有的文字吗？我猜它可能代表了…一种想要表达但又不知从何说起的感觉？'
      ];
    } else if (message.includes('你是谁')) {
      responses = [
        '我是柔柔熊，你的AI教练伙伴。不过，比起我是谁，也许更重要的是——你希望我是谁？',
        '我是陪你探索内心的伙伴。而当你在问‘你是谁’的时候，你心里期待的，是一个什么样的回答呢？'
      ];
    } else if (message.includes('天气')) {
      responses = [
        '我这里的服务器机房恒温恒湿~ 不过，我更关心你内心的天气如何？是晴空万里，还是有点多云呢？',
        '外面的天气我可能不清楚，但我们可以一起观察一下你心情的气候。'
      ];
    } else {
      // 通用幽默兜底
      responses = [
        `我听到了"${message}"。这个表达让你想到了什么？`,
        `${message}……当你说这个的时候，身体有什么感觉吗？`,
        `嗯，"${message}"。如果这个状态有一个温度，你觉得是多少度？`,
        `感受到了"${message}"。如果这个感受会说话，它想告诉你什么？`
      ];
    }
    
    const index = this.data.replyCounters.humor % responses.length;
    this.setData({
      'replyCounters.humor': this.data.replyCounters.humor + 1
    });
    
    return responses[index];
  },

  // 检测随机输入
  isRandomTyping(message) {
    // 检测连续的字母（如asdfghjkl）或重复字符
    if (message.length > 5 && /^[a-z]+$/.test(message)) {
      return true;
    }
    if (message.length > 3 && new Set(message.split('')).size === 1) {
      return true;
    }
    return false;
  },

  generateConversationTitle(firstMessage, messages) {
    let title = firstMessage.length > 10 ? 
      firstMessage.substring(0, 10) + '...' : firstMessage;
    
    // 情感化标题生成
    const lowerMessage = firstMessage.toLowerCase();
    if (lowerMessage.includes('无聊') || lowerMessage.includes('没意思')) {
      title = '探索心之所向';
    } else if (lowerMessage.includes('压力') || lowerMessage.includes('累')) {
      title = '压力觉察对话';
    } else if (lowerMessage.includes('迷茫') || lowerMessage.includes('困惑')) {
      title = '迷雾中的探索';
    } else if (lowerMessage.includes('快乐') || lowerMessage.includes('开心')) {
      title = '快乐时刻分享';
    } else if (lowerMessage.includes('自卑')) {
      title = '与自卑对话';
    } else if (lowerMessage.includes('emo') || lowerMessage.includes('裂开')) {
      title = '情绪充电时刻';
    }

    const conversation = {
      id: this.data.conversationId,
      title: title,
      preview: firstMessage,
      timestamp: new Date(),
      messageCount: messages.length
    };

    this.saveConversation(conversation);
    this.setData({ currentTitle: title });
  },

  saveMessages(messages) {
    wx.setStorageSync(`messages_${this.data.conversationId}`, messages);
  },

  saveConversation(conversation) {
    let conversations = wx.getStorageSync('ai_conversations') || [];
    // 移除同ID的旧对话
    conversations = conversations.filter(conv => conv.id !== conversation.id);
    conversations.unshift(conversation);
    // 只保留最近50个对话
    if (conversations.length > 50) {
      conversations = conversations.slice(0, 50);
    }
    wx.setStorageSync('ai_conversations', conversations);
  },

  scrollToBottom() {
    setTimeout(() => {
      this.setData({
        scrollTop: 999999
      });
    }, 100);
  },

  onShareAppMessage() {
    return {
      title: '柔柔熊 AI助手 - 你的情绪教练伙伴',
      path: '/pages/ai/chat/index'
    };
  }
});