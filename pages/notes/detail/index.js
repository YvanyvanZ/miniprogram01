// pages/notes/detail/detail.js
const db = wx.cloud.database()

Page({
  data: {
    date: '2025年10月13日',
    ganzhi: '乙卯日',
    content: '',
    images: [],
    
    // 7个预设标签
    presetTags: [
      { id: 1, name: '立足之境', selected: false },
      { id: 2, name: '心之所向', selected: false },
      { id: 3, name: '行进之势', selected: false },
      { id: 4, name: '变化之频', selected: false },
      { id: 5, name: '沉淀之实', selected: false },
      { id: 6, name: '动之仪', selected: false },
      { id: 7, name: '顿悟之跃', selected: false }
    ],
    selectedTags: [],
    showTagModal: false,
    isSaving: false
  },

  onLoad: function (options) {
    console.log('笔记详情页加载，参数:', options);
    this.getCurrentDate();
    this.getGanzhiData();
  },

  // 获取当前日期
  getCurrentDate: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.setData({
      date: `${year}年${month}月${day}日`
    });
  },

  // 获取干支数据
  getGanzhiData: function() {
    try {
      const app = getApp();
      if (app && app.globalData && app.globalData.currentGanzhi) {
        this.setData({
          ganzhi: app.globalData.currentGanzhi
        });
        return;
      }
      
      const cachedGanzhi = wx.getStorageSync('currentGanzhi');
      if (cachedGanzhi) {
        this.setData({
          ganzhi: cachedGanzhi
        });
        return;
      }
      
      // 确保显示乙卯日
      this.setData({
        ganzhi: '乙卯日'
      });
      
    } catch (error) {
      console.error('获取干支失败:', error);
      this.setData({
        ganzhi: '乙卯日'
      });
    }
  },

  // 输入笔记内容
  onInput: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  // 显示标签选择
  showTagSelector: function() {
    this.setData({
      showTagModal: true
    });
  },

  // 隐藏标签选择
  hideTagSelector: function() {
    this.setData({
      showTagModal: false
    });
  },

  // 选择标签
  onTagSelect: function(e) {
    const index = e.currentTarget.dataset.index;
    let presetTags = this.data.presetTags;
    
    // 切换选中状态
    presetTags[index].selected = !presetTags[index].selected;
    
    // 更新选中的标签列表
    const selectedTags = presetTags
      .filter(tag => tag.selected)
      .map(tag => tag.name);
    
    this.setData({
      presetTags: presetTags,
      selectedTags: selectedTags
    });
  },

  // 添加图片
  addImage: function() {
    const that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          images: that.data.images.concat(tempFilePaths)
        });
      }
    });
  },

  // 预览图片
  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    });
  },

  // 删除图片
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images
    });
  },

  // 保存笔记 - 云开发版本
  saveNote: function() {
    if (this.data.isSaving) return;
    
    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请填写笔记内容',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ isSaving: true });
    
    // 构建笔记数据
    const note = {
      date: this.data.date,
      ganzhi: this.data.ganzhi,
      content: this.data.content,
      tags: this.data.selectedTags,
      images: this.data.images,
      createTime: new Date(),
      updateTime: new Date()
    };
    
    console.log('保存笔记数据:', note);
    
    // 保存到云数据库
    db.collection('notes').add({
      data: note
    }).then(res => {
      console.log('云开发保存成功:', res);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        success: () => {
          setTimeout(() => {
            // 返回上一页
            wx.navigateBack();
          }, 1500);
        }
      });
    }).catch(err => {
      console.error('云开发保存失败:', err);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }).finally(() => {
      this.setData({ isSaving: false });
    });
  },

  // 返回
  goBack: function() {
    wx.navigateBack();
  }
})