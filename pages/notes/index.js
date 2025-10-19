// pages/notes/index.js
Page({
  data: {
    notesData: [
      {
        id: 'note1',
        date: '2024年1月15日',
        ganzhi: '甲子日',
        title: '今日甲子日能量观察',
        content: '今天感觉精力特别充沛，早上起来就很有活力...',
        tags: ['能量观察', '甲木', '子水']
      }
    ]
  },

  onLoad() {
    console.log('笔记列表页加载');
  },

  // 返回
  handleBackPress() {
    wx.navigateBack();
  },

  // 点击笔记
  handleNotePress(e) {
    const noteId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/notes/detail/index?noteId=${noteId}`
    });
  },

  // 创建新笔记
  handleCreateNote() {
    wx.navigateTo({
      url: '/pages/notes/detail/index?action=create'
    });
  }
})