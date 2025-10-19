// pages/my-notes/index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    notes: [],
    loading: true
  },

  onLoad(options) {
    console.log('笔记列表页加载');
    this.loadNotesFromCloud();
  },

  onShow() {
    console.log('笔记列表页显示，重新加载数据');
    this.loadNotesFromCloud();
  },

  onPullDownRefresh() {
    this.loadNotesFromCloud().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 从云开发加载笔记
  async loadNotesFromCloud() {
    try {
      console.log('开始从云开发加载笔记...');
      this.setData({ loading: true });
      
      const result = await db.collection('notes')
        .orderBy('createTime', 'desc')
        .get();
      
      console.log('从云开发获取到的笔记:', result.data);
      
      const notes = result.data.map(note => ({
        id: note._id,
        _id: note._id,
        date: note.date || '未知日期',
        ganzhi: note.ganzhi || '未知干支',
        content: note.content || '',
        tags: note.tags || [],
        images: note.images || [],
        createTime: note.createTime
      }));
      
      this.setData({
        notes: notes,
        loading: false
      });
      
    } catch (error) {
      console.error('从云开发加载笔记失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      this.setData({ 
        notes: [],
        loading: false
      });
    }
  },

  // 时间格式化方法
  formatTime(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // 如果是今天
      if (date.toDateString() === now.toDateString()) {
        return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
      
      // 如果是昨天
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
      
      // 其他情况
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (e) {
      return '';
    }
  },

  // 返回
  handleBackPress() {
    wx.navigateBack();
  },

  // 创建新笔记
  onCreateNote() {
    wx.navigateTo({
      url: '/pages/notes/detail/index'
    });
  },

  // 查看笔记详情 - 跳转到新的详情页
  onViewNoteDetail(e) {
    console.log('🎯 点击事件被触发');
    console.log('📋 事件对象:', e);
    console.log('🔍 dataset:', e.currentTarget.dataset);
    console.log('📒 note数据:', e.currentTarget.dataset.note);
    
    const note = e.currentTarget.dataset.note;
    
    if (note && note._id) {
      console.log('✅ 笔记ID:', note._id);
      console.log('🚀 准备跳转到详情页');
      
      wx.navigateTo({
        url: `/pages/note-detail/index?noteId=${note._id}`
      });
    } else {
      console.log('❌ 笔记数据异常，无法跳转');
      wx.showToast({
        title: '笔记数据异常',
        icon: 'none',
        duration: 2000
      });
    }
  }
})