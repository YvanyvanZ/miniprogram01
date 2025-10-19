// pages/ai/history/index.js
Page({
  data: {
    conversations: []
  },

  onLoad() {
    this.loadConversations();
  },

  loadConversations() {
    const conversations = wx.getStorageSync('ai_conversations') || [];
    this.setData({ conversations });
  },

  onConversationTap(e) {
    const conversation = e.currentTarget.dataset.conversation;
    wx.navigateTo({
      url: `/pages/ai/chat/index?conversationId=${conversation.id}`
    });
  },

  onNewChat() {
    wx.navigateTo({
      url: '/pages/ai/chat/index'
    });
  },

  onDeleteConversation(e) {
    const conversationId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除对话',
      content: '确定要删除这个对话吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteConversation(conversationId);
        }
      }
    });
  },

  deleteConversation(conversationId) {
    let conversations = wx.getStorageSync('ai_conversations') || [];
    conversations = conversations.filter(conv => conv.id !== conversationId);
    wx.setStorageSync('ai_conversations', conversations);
    this.setData({ conversations });
  }
});