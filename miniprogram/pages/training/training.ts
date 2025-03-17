// 训练计划页面
import { request } from "../../utils/request";

interface Template {
  id: number;
  name: string;
  frequency: string;
  usageCount: number;
  optimized: boolean;
}

interface StudentPlan {
  id: number;
  name: string;
  avatar: string;
  avatarStyle: string;
  phase: string;
  phaseTagClass: string;
  week: number;
  planName: string;
}

interface AIInsight {
  text: string;
}

Page({
  data: {
    statusBarHeight: 0,
    currentTab: "training",
    filterOptions: ["所有计划", "增肌计划", "减脂计划", "力量计划"],
    filterIndex: 0,
    searchText: "",
    templates: [] as Template[],
    studentPlans: [] as StudentPlan[],
    aiInsight: {
      text: "加载中...",
    } as AIInsight,
    loading: {
      templates: true,
      studentPlans: true,
      aiInsight: true,
    },
  },

  onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;

    // 设置标题栏高度
    this.setData({
      statusBarHeight: statusBarHeight,
    });

    // 加载数据
    this.fetchTemplates();
    this.fetchStudentPlans();
    this.fetchAIInsight();
  },

  onShow() {
    // 页面显示时刷新数据
    this.fetchTemplates();
    this.fetchStudentPlans();
  },

  // 获取模板数据
  async fetchTemplates() {
    try {
      this.setData({
        "loading.templates": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/templates',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const templates = [
          {
            id: 1,
            name: "初级增肌计划",
            frequency: "3天训练/周",
            usageCount: 5,
            optimized: true,
          },
          {
            id: 2,
            name: "中级增肌计划",
            frequency: "4天训练/周",
            usageCount: 3,
            optimized: true,
          },
          {
            id: 3,
            name: "高强度减脂计划",
            frequency: "5天训练/周",
            usageCount: 4,
            optimized: false,
          },
          {
            id: 4,
            name: "力量训练计划",
            frequency: "4天训练/周",
            usageCount: 2,
            optimized: false,
          },
        ];

        this.setData({
          templates,
          "loading.templates": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取模板数据失败", error);
      wx.showToast({
        title: "获取模板数据失败",
        icon: "none",
      });
      this.setData({
        "loading.templates": false,
      });
    }
  },

  // 获取学员计划数据
  async fetchStudentPlans() {
    try {
      this.setData({
        "loading.studentPlans": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/student-plans',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const studentPlans = [
          {
            id: 1,
            name: "张三",
            avatar: "张",
            avatarStyle: "",
            phase: "增肌期",
            phaseTagClass: "tag-bulking",
            week: 8,
            planName: "初级增肌计划",
          },
          {
            id: 2,
            name: "王五",
            avatar: "王",
            avatarStyle: "",
            phase: "维持期",
            phaseTagClass: "tag-maintenance",
            week: 12,
            planName: "中级增肌计划",
          },
          {
            id: 3,
            name: "钱七",
            avatar: "钱",
            avatarStyle: "background: #FFEBEE; color: #F44336;",
            phase: "减脂期",
            phaseTagClass: "tag-cutting",
            week: 2,
            planName: "高强度减脂计划",
          },
        ];

        this.setData({
          studentPlans,
          "loading.studentPlans": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取学员计划数据失败", error);
      wx.showToast({
        title: "获取学员计划数据失败",
        icon: "none",
      });
      this.setData({
        "loading.studentPlans": false,
      });
    }
  },

  // 获取AI见解数据
  async fetchAIInsight() {
    try {
      this.setData({
        "loading.aiInsight": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/ai-insights',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const aiInsight = {
          text: "根据最近数据，3名学员的训练计划需要更新。张三的卧推进步迅速，建议增加重量。李四的减脂计划效果不佳，建议调整饮食方案。",
        };

        this.setData({
          aiInsight,
          "loading.aiInsight": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取AI见解数据失败", error);
      wx.showToast({
        title: "获取AI见解数据失败",
        icon: "none",
      });
      this.setData({
        "loading.aiInsight": false,
      });
    }
  },

  // 搜索输入
  onSearchInput(e: any) {
    this.setData({
      searchText: e.detail.value,
    });
    // 实际应用中可以实现实时搜索功能
    this.searchPlans();
  },

  // 搜索计划
  searchPlans() {
    // 实际应用中应该从服务器搜索数据
    // request({
    //   url: '/api/search-plans',
    //   method: 'POST',
    //   data: {
    //     keyword: this.data.searchText,
    //     filter: this.data.filterOptions[this.data.filterIndex]
    //   }
    // }).then(res => {
    //   this.setData({
    //     templates: res.data.templates,
    //     studentPlans: res.data.studentPlans
    //   });
    // });

    console.log("搜索关键词:", this.data.searchText);
    console.log("过滤条件:", this.data.filterOptions[this.data.filterIndex]);
  },

  // 过滤选择
  onFilterChange(e: any) {
    this.setData({
      filterIndex: e.detail.value,
    });
    // 实际应用中可以实现过滤功能
    this.searchPlans();
  },

  // 查看模板详情
  viewTemplate(e: any) {
    const templateId = e.currentTarget.dataset.templateId;
    const template = this.data.templates.find((t) => t.id === templateId);

    if (template) {
      wx.showToast({
        title: `查看${template.name}`,
        icon: "none",
      });

      // 实际应用中可以跳转到模板详情页
      // wx.navigateTo({
      //   url: `/pages/templateDetail/templateDetail?id=${templateId}`
      // });
    }
  },

  // 创建AI模板
  createAITemplate() {
    wx.showToast({
      title: "创建智能模板",
      icon: "none",
    });

    // 实际应用中可以跳转到创建模板页面
    // wx.navigateTo({
    //   url: '/pages/createTemplate/createTemplate'
    // });
  },

  // 编辑计划
  editPlan(e: any) {
    const planId = e.currentTarget.dataset.planId;
    const plan = this.data.studentPlans.find((p) => p.id === planId);

    if (plan) {
      wx.showToast({
        title: `编辑${plan.name}的${plan.planName}`,
        icon: "none",
      });

      // 实际应用中可以跳转到计划编辑页
      // wx.navigateTo({
      //   url: `/pages/editPlan/editPlan?id=${planId}`
      // });
    }
  },

  // 批量优化计划
  batchOptimize() {
    wx.showToast({
      title: "批量AI优化计划",
      icon: "none",
    });

    // 实际应用中可以调用API进行批量优化
    // request({
    //   url: '/api/batch-optimize',
    //   method: 'POST'
    // }).then(res => {
    //   wx.showToast({
    //     title: '优化成功',
    //     icon: 'success'
    //   });
    //   this.fetchTemplates();
    //   this.fetchStudentPlans();
    // });
  },

  // 创建新计划
  createNewPlan() {
    wx.showToast({
      title: "创建新计划",
      icon: "none",
    });

    // 实际应用中可以跳转到创建计划页面
    // wx.navigateTo({
    //   url: '/pages/createPlan/createPlan'
    // });
  },

  // 切换底部标签页
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;

    if (tab === this.data.currentTab) return;

    this.setData({
      currentTab: tab,
    });

    // 根据标签切换页面
    if (tab === "assistant") {
      wx.redirectTo({ url: "/pages/coachX/coachX" });
    } else if (tab === "students") {
      wx.redirectTo({ url: "/pages/students/students" });
    }
  },

  // 智能生成训练计划
  generatePlan() {
    wx.showToast({
      title: "智能生成训练计划",
      icon: "none",
    });

    // 实际应用中可以跳转到生成计划页面
    // wx.navigateTo({
    //   url: '/pages/generatePlan/generatePlan'
    // });
  },

  // 计划效果分析
  analyzePlanEffect() {
    wx.showToast({
      title: "计划效果分析",
      icon: "none",
    });

    // 实际应用中可以跳转到效果分析页面
    // wx.navigateTo({
    //   url: '/pages/analyzeEffect/analyzeEffect'
    // });
  },

  // 根据进度调整
  adjustByProgress() {
    wx.showToast({
      title: "根据进度调整",
      icon: "none",
    });

    // 实际应用中可以跳转到进度调整页面
    // wx.navigateTo({
    //   url: '/pages/adjustProgress/adjustProgress'
    // });
  },

  // 重新生成AI见解
  refreshInsight() {
    wx.showToast({
      title: "正在重新生成AI见解...",
      icon: "loading",
      duration: 1500,
    });

    // 实际应用中应该调用API获取新的AI见解
    // request({
    //   url: '/api/refresh-insight',
    //   method: 'POST'
    // }).then(res => {
    //   this.setData({
    //     aiInsight: res.data
    //   });
    //   wx.showToast({
    //     title: 'AI见解已更新',
    //     icon: 'success'
    //   });
    // });

    // 模拟从服务器获取数据
    setTimeout(() => {
      const aiInsight = {
        text: "【更新】根据最新数据分析，张三的力量提升显著，建议增加训练强度。王五的体脂率下降缓慢，需要调整有氧训练方案。钱七的训练频率不足，建议增加每周训练次数。",
      };

      this.setData({
        aiInsight,
      });

      wx.showToast({
        title: "AI见解已更新",
        icon: "success",
      });
    }, 1500);
  },

  // 查看学员计划详情
  viewStudentPlan(e: any) {
    const studentId = e.currentTarget.dataset.studentId;

    // 跳转到计划详情页面
    wx.navigateTo({
      url: `/pages/planDetail/planDetail?id=${studentId}&from=training`,
    });
  },
});
