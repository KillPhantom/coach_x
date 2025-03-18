// 训练计划页面
import { request } from "../../utils/request";

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  level: string;
  duration: string;
}

interface Student {
  id: number;
  name: string;
  avatar: string;
  avatarStyle: string;
  phase: string;
  phaseTagClass: string;
  week: number;
  planName: string;
  height: number;
  weight: number;
  weightChange: number;
}

interface AIInsight {
  text: string;
}

Page({
  data: {
    statusBarHeight: 0,
    currentTab: "training",
    activeSection: "templates", // 'templates' 或 'students'
    filterOptions: ["所有计划", "增肌计划", "减脂计划", "力量计划"],
    filterIndex: 0,
    searchText: "",
    templates: [] as Template[],
    students: [] as Student[],
    aiInsight: {
      text: "加载中...",
    } as AIInsight,
    loading: {
      templates: true,
      students: true,
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
      currentTab: "training",
    });

    // 加载数据
    this.fetchTemplates();
    this.fetchStudents();
    this.fetchAIInsight();
  },

  onShow() {
    // 页面显示时刷新数据
    this.fetchTemplates();
    this.fetchStudents();
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
            description: "适合初学者的全身增肌训练计划，每周3次训练",
            category: "增肌",
            level: "初级",
            duration: "8周",
          },
          {
            id: 2,
            name: "中级增肌计划",
            description: "适合有一定基础的训练者，分化训练，每周4次",
            category: "增肌",
            level: "中级",
            duration: "12周",
          },
          {
            id: 3,
            name: "高级增肌计划",
            description: "高强度、高频率的增肌计划，适合有经验的训练者",
            category: "增肌",
            level: "高级",
            duration: "16周",
          },
          {
            id: 4,
            name: "减脂塑形计划",
            description: "结合力量训练和有氧训练，帮助减脂塑形",
            category: "减脂",
            level: "中级",
            duration: "8周",
          },
          {
            id: 5,
            name: "功能性训练计划",
            description: "提高整体运动能力和身体机能的训练计划",
            category: "功能性",
            level: "全级别",
            duration: "6周",
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

  // 获取学员数据
  async fetchStudents() {
    try {
      this.setData({
        "loading.students": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/students',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const students = [
          {
            id: 1,
            name: "张三",
            avatar: "张",
            avatarStyle: "background-color: #1890ff; color: white;",
            phase: "增肌期",
            phaseTagClass: "tag-bulking",
            week: 8,
            planName: "初级增肌计划",
            height: 178,
            weight: 75.5,
            weightChange: 0.8,
          },
          {
            id: 2,
            name: "李四",
            avatar: "李",
            avatarStyle: "background-color: #52c41a; color: white;",
            phase: "减脂期",
            phaseTagClass: "tag-cutting",
            week: 4,
            planName: "减脂塑形计划",
            height: 175,
            weight: 80.2,
            weightChange: -1.2,
          },
          {
            id: 3,
            name: "王五",
            avatar: "王",
            avatarStyle: "background-color: #722ed1; color: white;",
            phase: "维持期",
            phaseTagClass: "tag-maintaining",
            week: 12,
            planName: "功能性训练计划",
            height: 182,
            weight: 78.0,
            weightChange: 0.0,
          },
          {
            id: 4,
            name: "赵六",
            avatar: "赵",
            avatarStyle: "background-color: #fa8c16; color: white;",
            phase: "增肌期",
            phaseTagClass: "tag-bulking",
            week: 6,
            planName: "中级增肌计划",
            height: 180,
            weight: 82.5,
            weightChange: 0.5,
          },
          {
            id: 5,
            name: "钱七",
            avatar: "钱",
            avatarStyle: "background-color: #eb2f96; color: white;",
            phase: "减脂期",
            phaseTagClass: "tag-cutting",
            week: 2,
            planName: "减脂塑形计划",
            height: 168,
            weight: 65.8,
            weightChange: -0.7,
          },
        ];

        this.setData({
          students,
          "loading.students": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取学员数据失败", error);
      wx.showToast({
        title: "获取学员数据失败",
        icon: "none",
      });
      this.setData({
        "loading.students": false,
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
    //     students: res.data.students
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

  // 编辑训练计划
  editPlan(e: any) {
    const studentId = e.currentTarget.dataset.planId;

    // 直接跳转到计划详情页面
    wx.navigateTo({
      url: `../planDetail/planDetail?id=${studentId}&from=training`,
    });
  },

  // 应用训练计划
  applyPlan(e: any) {
    const templateId = e.currentTarget.dataset.templateId;
    const templateName =
      this.data.templates.find((t) => t.id === templateId)?.name || "";

    // 显示学员选择列表
    wx.showActionSheet({
      itemList: this.data.students.map((student) => student.name),
      success: (res) => {
        const studentId = this.data.students[res.tapIndex].id;
        const studentName = this.data.students[res.tapIndex].name;

        wx.showModal({
          title: "应用训练计划",
          content: `确定要将"${templateName}"应用到${studentName}的训练计划中吗？`,
          success: (res) => {
            if (res.confirm) {
              wx.showToast({
                title: "应用成功",
                icon: "success",
              });
            }
          },
        });
      },
    });
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

  // 切换训练计划部分
  switchSection(e: any) {
    const section = e.currentTarget.dataset.section;
    this.setData({
      activeSection: section,
    });

    // 如果切换到学员部分且尚未加载数据，则加载学员数据
    if (section === "students" && this.data.students.length === 0) {
      this.fetchStudents();
    }
  },

  // 创建新计划
  createNewPlan() {
    // 直接跳转到计划详情页面，但传递特殊参数表示是新计划
    wx.navigateTo({
      url: `../planDetail/planDetail?isNew=true&from=training`,
    });
  },
});
