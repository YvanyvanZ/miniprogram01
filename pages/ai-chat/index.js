Page({
  data: {
    messages: [],
    inputMessage: '',
    isLoading: false,
    scrollTop: 0
  },

  onLoad() {
    this.addMessage({
      role: 'assistant',
      content: '嗨， 🌟 在星光闪烁的夜晚，我很高兴能成为你的倾听伙伴。',
      id: this.generateId()
    })
  },

  onInput(e) {
    this.setData({
      inputMessage: e.detail.value
    })
  },

  async sendMessage() {
    const message = this.data.inputMessage.trim()
    if (!message || this.data.isLoading) return

    console.log('发送消息:', message)

    // 添加用户消息
    const userMessage = {
      role: 'user',
      content: message,
      id: this.generateId()
    }
    this.addMessage(userMessage)
    
    this.setData({
      inputMessage: '',
      isLoading: true
    })

    try {
      // 调用云函数
      const result = await wx.cloud.callFunction({
        name: 'aibear',
        data: {
          message: message
        }
      })

      console.log('云函数返回:', result)

      if (result.result.success) {
        this.addMessage({
          role: 'assistant',
          content: result.result.reply,
          id: this.generateId()
        })
      } else {
        this.addMessage({
          role: 'assistant',
          content: result.result.reply || '🌙 柔柔熊暂时无法回应',
          id: this.generateId()
        })
      }
    } catch (error) {
      console.error('调用云函数失败:', error)
      this.addMessage({
        role: 'assistant',
        content: '✨ 网络连接异常，请稍后重试',
        id: this.generateId()
      })
    } finally {
      this.setData({
        isLoading: false
      })
    }
  },

  addMessage(message) {
    this.setData({
      messages: [...this.data.messages, message]
    })
    
    // 滚动到底部
    setTimeout(() => {
      this.setData({
        scrollTop: 999999
      })
    }, 100)
  },

  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9)
  }
})