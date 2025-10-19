// pages/note-detail/note-detail.js
const db = wx.cloud.database()

Page({
  data: {
    noteId: '',
    noteData: {
      date: '',
      ganzhi: '',
      content: '',
      images: [],
      tags: [],
      createTime: ''
    },
    loading: true
  },

  onLoad: function (options) {
    console.log('笔记详情页参数:', options);
    
    const { noteId } = options;
    if (noteId) {
      this.setData({ noteId });
      this.loadNoteDetail(noteId);
    } else {
      wx.showToast({
        title: '笔记不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 加载笔记详情
  async loadNoteDetail(noteId) {
    try {
      console.log('开始加载笔记详情:', noteId);
      this.setData({ loading: true });
      
      const result = await db.collection('notes').doc(noteId).get();
      console.log('笔记详情数据:', result.data);
      
      if (result.data) {
        this.setData({
          noteData: {
            date: result.data.date || '未知日期',
            ganzhi: result.data.ganzhi || '未知干支',
            content: result.data.content || '',
            images: result.data.images || [],
            tags: result.data.tags || [],
            createTime: result.data.createTime
          },
          loading: false
        });
      } else {
        throw new Error('笔记不存在');
      }
      
    } catch (error) {
      console.error('加载笔记详情失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 预览图片
  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.noteData.images;
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  // 时间格式化
  formatTime: function(dateString) {
    if (!dateString) return '未知时间';
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch (e) {
      return '未知时间';
    }
  },

  // 返回
  goBack: function() {
    wx.navigateBack();
  },

  // 编辑笔记
  editNote: function() {
    const { noteId } = this.data;
    wx.redirectTo({
      url: `/pages/notes/detail/index?noteId=${noteId}&mode=edit`
    });
  }
})