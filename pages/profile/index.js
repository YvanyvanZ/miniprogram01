Page({
  data: {
    userProfileData: {
      nickname: '能量探索者',
      uid: '123456789',
      consecutiveDays: 15,
      purchasedCourses: 8,
      notesCount: 42,
      bio: ''
    },
    isEditProfileModalVisible: false,
    isLogoutConfirmModalVisible: false,
    editNickname: '能量探索者',
    editBio: ''
  },

  onLoad() {
    this.loadUserData();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadUserData();
  },

  loadUserData() {
    try {
      const userData = wx.getStorageSync('userProfileData');
      if (userData) {
        this.setData({
          userProfileData: userData,
          editNickname: userData.nickname,
          editBio: userData.bio || ''
        });
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  },

  handleBackPress() {
    wx.navigateBack();
  },

  handleMyCoursesPress() {
    wx.navigateTo({
      url: '/pages/my-courses/index'
    });
  },

  handleMyOrdersPress() {
    wx.navigateTo({
      url: '/pages/my-orders/index'
    });
  },

  handleMyNotesPress() {
    wx.navigateTo({
      url: '/pages/my-notes/index'
    });
  },

  handleMyCollectionsPress() {
    wx.navigateTo({
      url: '/pages/my-collections/index'
    });
  },

  handleHistoryPuzzlesPress() {
    wx.navigateTo({
      url: '/pages/puzzle-history/index'
    });
  },

  handleSettingsPress() {
    wx.showToast({
      title: '设置功能暂未开放',
      icon: 'none'
    });
  },

  handleLogoutPress() {
    this.setData({
      isLogoutConfirmModalVisible: true
    });
  },

  handleAvatarPress() {
    this.setData({
      isEditProfileModalVisible: true
    });
  },

  handleNicknamePress() {
    this.setData({
      isEditProfileModalVisible: true
    });
  },

  handleCloseEditModal() {
    this.setData({
      isEditProfileModalVisible: false,
      editNickname: this.data.userProfileData.nickname,
      editBio: this.data.userProfileData.bio || ''
    });
  },

  onEditNicknameChange(e) {
    this.setData({
      editNickname: e.detail.value
    });
  },

  onEditBioChange(e) {
    this.setData({
      editBio: e.detail.value
    });
  },

  handleSaveEditProfile() {
    const trimmedNickname = this.data.editNickname.trim();
    if (!trimmedNickname) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none'
      });
      return;
    }

    if (trimmedNickname.length > 20) {
      wx.showToast({
        title: '昵称不能超过20个字符',
        icon: 'none'
      });
      return;
    }

    if (this.data.editBio.length > 100) {
      wx.showToast({
        title: '简介不能超过100个字符',
        icon: 'none'
      });
      return;
    }

    try {
      const newUserData = {
        ...this.data.userProfileData,
        nickname: trimmedNickname,
        bio: this.data.editBio.trim()
      };

      this.setData({
        userProfileData: newUserData,
        isEditProfileModalVisible: false
      });

      wx.setStorageSync('userProfileData', newUserData);

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('保存用户数据失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  handleCancelLogout() {
    this.setData({
      isLogoutConfirmModalVisible: false
    });
  },

  handleConfirmLogout() {
    this.setData({
      isLogoutConfirmModalVisible: false
    });

    // 清除用户登录状态
    wx.removeStorageSync('userToken');
    wx.removeStorageSync('userProfileData');

    // 修正跳转路径
    wx.reLaunch({
      url: '/pages/login_register/index'
    });
  }
});