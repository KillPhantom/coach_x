// AI助手页面
import { request } from "../../utils/request";

interface DailyStat {
  completedTrainings: number;
  needReminders: number;
  plansToUpdate: number;
}

interface AISuggestion {
  content: string;
  timestamp: string;
}

interface Student {
  id: number;
  name: string;
  avatar: string;
  avatarStyle: string;
  status: string;
  statusClass: string;
  tag: string;
  tagClass: string;
  daysInactive: number;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    currentPage: "ai-assistant-page", // 当前显示的页面
    currentTab: "assistant", // 当前选中的标签页
    dailyStats: {} as DailyStat,
    aiSuggestion: {} as AISuggestion,
    studentsNeedAttention: [] as Student[],
    excellentStudents: [] as Student[],
    loading: {
      dailyStats: true,
      aiSuggestion: true,
      studentsNeedAttention: true,
      excellentStudents: true,
    },
    generatingReport: false,
  },

  /**
   * 切换底部标签页
   */
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;

    if (tab === this.data.currentTab) return;

    this.setData({
      currentTab: tab,
    });

    // 根据标签切换页面
    if (tab === "students") {
      wx.redirectTo({ url: "/pages/students/students" });
    } else if (tab === "training") {
      wx.redirectTo({ url: "/pages/training/training" });
    }
  },

  /**
   * 查看所有学员
   */
  viewAllStudents() {
    this.setData({
      currentPage: "students-page",
      currentTab: "students",
    });
  },

  /**
   * 查看学员详情
   */
  viewStudentDetail(e: any) {
    const studentName = e.currentTarget.dataset.student;
    wx.showToast({
      title: `查看${studentName}的详情`,
      icon: "none",
    });
    // 实际应用中应该跳转到学员详情页
    this.setData({
      currentPage: "student-detail-page",
    });
  },

  /**
   * 提醒学员
   */
  remindStudent(e: any) {
    const studentName = e.currentTarget.dataset.student;
    wx.showLoading({
      title: "发送提醒中...",
    });
    // 实际应用中应该调用API发送提醒
    // request({
    //   url: '/api/remind-student',
    //   method: 'POST',
    //   data: {
    //     studentId: e.currentTarget.dataset.studentId
    //   }
    // }).then(res => {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '提醒已发送',
    //     icon: 'success'
    //   });
    // }).catch(err => {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '发送提醒失败',
    //     icon: 'none'
    //   });
    // });
    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: `已提醒${studentName}`,
        icon: "success",
      });
    }, 1000);
  },

  /**
   * 更新计划
   */
  updatePlan(e: any) {
    const student = e.currentTarget.dataset.student;
    wx.showToast({
      title: `更新${student}的计划`,
      icon: "none",
    });
  },

  /**
   * AI功能点击事件
   */
  onAIFeature(e: any) {
    const feature = e.currentTarget.dataset.feature;

    if (feature === "report") {
      this.generateDailyReport();
    } else if (feature === "analysis") {
      this.generateDataAnalysis();
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    // 根据当前页面决定返回到哪个页面
    if (this.data.currentPage === "student-detail-page") {
      this.setData({ currentPage: "students-page" });
    } else if (this.data.currentPage === "plan-detail-page") {
      this.setData({ currentPage: "training-plan-page" });
    } else {
      this.setData({ currentPage: "ai-assistant-page" });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;

    // 设置标题栏高度
    this.setData({
      statusBarHeight: statusBarHeight,
    });

    // 加载数据
    this.fetchDailyStats();
    this.fetchAISuggestion();
    this.fetchStudentsNeedAttention();
    this.fetchExcellentStudents();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时刷新数据
    this.fetchDailyStats();
    this.fetchStudentsNeedAttention();
    this.fetchExcellentStudents();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  // 获取每日统计数据
  async fetchDailyStats() {
    try {
      this.setData({
        "loading.dailyStats": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/daily-stats',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const dailyStats = {
          completedTrainings: 8,
          needReminders: 5,
          plansToUpdate: 3,
        };

        this.setData({
          dailyStats,
          "loading.dailyStats": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取每日统计数据失败", error);
      wx.showToast({
        title: "获取每日统计数据失败",
        icon: "none",
      });
      this.setData({
        "loading.dailyStats": false,
      });
    }
  },

  // 获取AI建议
  async fetchAISuggestion() {
    try {
      this.setData({
        "loading.aiSuggestion": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/ai-suggestion',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");

        const aiSuggestion = {
          content:
            "张三和李四的训练进度超出预期，建议调整计划强度。王五需要增加肩部训练频率，胸部发展良好。",
          timestamp: `今天 ${hours}:${minutes}`,
        };

        this.setData({
          aiSuggestion,
          "loading.aiSuggestion": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取AI建议失败", error);
      wx.showToast({
        title: "获取AI建议失败",
        icon: "none",
      });
      this.setData({
        "loading.aiSuggestion": false,
      });
    }
  },

  // 获取需要关注的学员
  async fetchStudentsNeedAttention() {
    try {
      this.setData({
        "loading.studentsNeedAttention": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/students-need-attention',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const studentsNeedAttention = [
          {
            id: 1,
            name: "李四",
            avatar: "李",
            avatarStyle: "",
            status: "2天未更新状态",
            statusClass: "warning-status",
            tag: "减脂期",
            tagClass: "tag-cutting",
            daysInactive: 2,
          },
          {
            id: 2,
            name: "钱七",
            avatar: "钱",
            avatarStyle: "",
            status: "5天未更新状态",
            statusClass: "warning-status",
            tag: "减脂期",
            tagClass: "tag-cutting",
            daysInactive: 5,
          },
          {
            id: 3,
            name: "赵六",
            avatar: "赵",
            avatarStyle: "",
            status: "训练计划即将到期",
            statusClass: "info-status",
            tag: "增肌期",
            tagClass: "tag-bulking",
            daysInactive: 1,
          },
        ];

        this.setData({
          studentsNeedAttention,
          "loading.studentsNeedAttention": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取需要关注的学员失败", error);
      wx.showToast({
        title: "获取需要关注的学员失败",
        icon: "none",
      });
      this.setData({
        "loading.studentsNeedAttention": false,
      });
    }
  },

  // 生成每日训练报告
  async generateDailyReport() {
    this.setData({
      generatingReport: true,
    });

    wx.showLoading({
      title: "AI正在生成报告...",
    });

    // 实际应用中应该从服务器获取数据
    // try {
    //   const res = await request({
    //     url: '/api/generate-daily-report',
    //     method: 'POST'
    //   });
    //
    //   wx.hideLoading();
    //
    //   wx.navigateTo({
    //     url: `/pages/reportDetail/reportDetail?id=${res.data.reportId}`
    //   });
    // } catch (error) {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '生成报告失败',
    //     icon: 'none'
    //   });
    // }

    // 模拟从服务器获取数据
    setTimeout(() => {
      this.setData({
        generatingReport: false,
      });

      wx.hideLoading();

      wx.showModal({
        title: "训练报告已生成",
        content:
          "AI已完成今日训练报告生成，包含8名学员的训练数据分析和3项改进建议。",
        confirmText: "查看报告",
        success: (res) => {
          if (res.confirm) {
            // 实际应用中可以跳转到报告详情页
            wx.showToast({
              title: "查看训练报告",
              icon: "none",
            });
          }
        },
      });
    }, 2000);
  },

  // 生成数据分析报告
  generateDataAnalysis() {
    wx.showToast({
      title: "生成数据分析报告",
      icon: "none",
    });

    // 实际应用中可以跳转到数据分析页面
    // wx.navigateTo({
    //   url: '/pages/dataAnalysis/dataAnalysis'
    // });
  },

  // 获取优秀学员
  async fetchExcellentStudents() {
    try {
      this.setData({
        "loading.excellentStudents": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/excellent-students',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const excellentStudents = [
          {
            id: 4,
            name: "张三",
            avatar: "张",
            avatarStyle: "",
            status: "连续训练14天",
            statusClass: "excellent-status",
            tag: "增肌期",
            tagClass: "tag-bulking",
            daysInactive: 0,
          },
          {
            id: 5,
            name: "王五",
            avatar: "王",
            avatarStyle: "",
            status: "进步显著",
            statusClass: "excellent-status",
            tag: "维持期",
            tagClass: "tag-maintenance",
            daysInactive: 0,
          },
          {
            id: 6,
            name: "孙七",
            avatar: "孙",
            avatarStyle: "",
            status: "达成月度目标",
            statusClass: "excellent-status",
            tag: "增肌期",
            tagClass: "tag-bulking",
            daysInactive: 0,
          },
        ];

        this.setData({
          excellentStudents,
          "loading.excellentStudents": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取优秀学员失败", error);
      wx.showToast({
        title: "获取优秀学员失败",
        icon: "none",
      });
      this.setData({
        "loading.excellentStudents": false,
      });
    }
  },

  // 鼓励学员
  praiseStudent(e: any) {
    const studentName = e.currentTarget.dataset.student;
    wx.showLoading({
      title: "发送鼓励中...",
    });

    // 实际应用中应该调用API发送鼓励
    // request({
    //   url: '/api/praise-student',
    //   method: 'POST',
    //   data: {
    //     studentId: e.currentTarget.dataset.studentId
    //   }
    // }).then(res => {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '鼓励已发送',
    //     icon: 'success'
    //   });
    // }).catch(err => {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '发送鼓励失败',
    //     icon: 'none'
    //   });
    // });

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: `已鼓励${studentName}`,
        icon: "success",
      });
    }, 1000);
  },
});
