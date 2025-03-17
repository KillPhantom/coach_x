// 学员管理页面
import { request } from "../../utils/request";

interface Student {
  id: number;
  name: string;
  avatar: string;
  avatarStyle: string;
  status: string;
  statusStyle: string;
  tag: string;
  tagClass: string;
}

interface StudentStats {
  total: number;
  active: number;
  needAttention: number;
}

Page({
  data: {
    statusBarHeight: 0,
    currentTab: "students",
    filterOptions: ["所有学员", "活跃学员", "需要关注", "新学员"],
    filterIndex: 0,
    searchText: "",
    students: [] as Student[],
    stats: {} as StudentStats,
    loading: {
      students: true,
      stats: true,
    },
    pagination: {
      page: 1,
      pageSize: 10,
      hasMore: true,
    },
    scrollHeight: 0,
    isLoadingMore: false,
  },

  onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;

    // 设置标题栏高度和滚动区域高度
    // 只需减去标题栏和底部导航栏的高度
    this.setData({
      statusBarHeight: statusBarHeight,
      scrollHeight: systemInfo.windowHeight - statusBarHeight - 44 - 50, // 标题栏高度44px，底部导航栏高度50px
    });

    // 加载数据
    this.fetchStudentStats();
    this.fetchStudents(true);
  },

  onShow() {
    // 页面显示时刷新数据
    this.fetchStudentStats();
  },

  // 获取学员统计数据
  async fetchStudentStats() {
    try {
      this.setData({
        "loading.stats": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/student-stats',
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const stats = {
          total: 15,
          active: 8,
          needAttention: 3,
        };

        this.setData({
          stats,
          "loading.stats": false,
        });
      }, 500);
    } catch (error) {
      console.error("获取学员统计数据失败", error);
      wx.showToast({
        title: "获取学员统计数据失败",
        icon: "none",
      });
      this.setData({
        "loading.stats": false,
      });
    }
  },

  // 获取学员列表数据
  async fetchStudents(refresh = false) {
    try {
      // 如果是刷新，重置分页
      if (refresh) {
        this.setData({
          "pagination.page": 1,
          "pagination.hasMore": true,
          students: [],
          "loading.students": true,
        });
      } else {
        // 如果是加载更多，设置加载状态
        this.setData({
          isLoadingMore: true,
        });
      }

      // 如果没有更多数据，直接返回
      if (!refresh && !this.data.pagination.hasMore) {
        this.setData({
          isLoadingMore: false,
        });
        return;
      }

      const { page, pageSize } = this.data.pagination;
      const filterType = this.data.filterOptions[this.data.filterIndex];
      const searchText = this.data.searchText;

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: '/api/students',
      //   method: 'GET',
      //   data: {
      //     page,
      //     pageSize,
      //     filterType,
      //     searchText
      //   }
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        // 模拟根据筛选条件和搜索文本过滤数据
        let filteredStudents = [];

        // 生成模拟数据
        const generateStudents = (count: number, startId: number) => {
          const students = [];
          const statuses = ["活跃", "需要关注", "新学员"];
          const tags = ["增肌期", "减脂期", "维持期"];
          const tagClasses = ["tag-bulking", "tag-cutting", "tag-maintenance"];

          for (let i = 0; i < count; i++) {
            const id = startId + i;
            const name = `学员${id}`;
            const statusIndex = Math.floor(Math.random() * 3);
            const tagIndex = Math.floor(Math.random() * 3);

            students.push({
              id,
              name,
              avatar: name.substring(0, 1),
              avatarStyle: "",
              status: statuses[statusIndex],
              statusStyle: statusIndex === 1 ? "color: #ff4d4f;" : "",
              tag: tags[tagIndex],
              tagClass: tagClasses[tagIndex],
            });
          }

          return students;
        };

        // 根据当前页码生成数据
        const startId = (page - 1) * pageSize + 1;
        const hasMore = page < 3; // 模拟只有3页数据

        // 模拟最后一页数据量可能不足pageSize
        const count = hasMore
          ? pageSize
          : Math.floor(Math.random() * pageSize) + 1;
        filteredStudents = generateStudents(count, startId);

        // 如果有搜索文本，模拟过滤
        if (searchText) {
          filteredStudents = filteredStudents.filter((student) =>
            student.name.includes(searchText)
          );
        }

        // 如果有筛选条件，模拟过滤
        if (filterType !== "所有学员") {
          filteredStudents = filteredStudents.filter((student) => {
            if (filterType === "活跃学员") return student.status === "活跃";
            if (filterType === "需要关注") return student.status === "需要关注";
            if (filterType === "新学员") return student.status === "新学员";
            return true;
          });
        }

        this.setData({
          students: refresh
            ? filteredStudents
            : [...this.data.students, ...filteredStudents],
          "loading.students": false,
          isLoadingMore: false,
          "pagination.page": page + 1,
          "pagination.hasMore": hasMore,
        });
      }, 800);
    } catch (error) {
      console.error("获取学员列表数据失败", error);
      wx.showToast({
        title: "获取学员列表数据失败",
        icon: "none",
      });
      this.setData({
        "loading.students": false,
        isLoadingMore: false,
      });
    }
  },

  // 搜索输入
  onSearchInput(e: any) {
    this.setData({
      searchText: e.detail.value,
    });

    // 实现防抖，避免频繁请求
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.fetchStudents(true);
    }, 500);
  },

  // 过滤选择
  onFilterChange(e: any) {
    this.setData({
      filterIndex: e.detail.value,
    });

    // 切换筛选条件后重新加载数据
    this.fetchStudents(true);
  },

  // 查看AI分组建议
  viewAIGroups() {
    wx.showToast({
      title: "查看AI分组建议",
      icon: "none",
    });

    // 实际应用中可以跳转到AI分组建议页面
    // wx.navigateTo({
    //   url: '/pages/aiGroups/aiGroups'
    // });
  },

  // 管理学员
  manageStudents() {
    wx.showToast({
      title: "管理学员",
      icon: "none",
    });

    // 实际应用中可以跳转到学员管理页面
    // wx.navigateTo({
    //   url: '/pages/manageStudents/manageStudents'
    // });
  },

  // 查看学员详情
  viewStudentDetail(e: any) {
    const studentId = e.currentTarget.dataset.studentId;
    const student = this.data.students.find((s) => s.id === studentId);

    if (student) {
      // 跳转到计划详情页面
      wx.navigateTo({
        url: `/pages/planDetail/planDetail?id=${studentId}&from=students`,
      });
    }
  },

  // 添加新学员
  addNewStudent() {
    // 显示加载中
    wx.showLoading({
      title: "生成邀请码...",
      mask: true,
    });

    // 模拟从后端获取邀请码
    setTimeout(() => {
      wx.hideLoading();

      // 生成随机邀请码
      const inviteCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

      // 显示邀请码模态框
      wx.showModal({
        title: "添加新学员",
        content: `邀请码已生成: ${inviteCode}\n您可以将此邀请码分享给学员`,
        confirmText: "分享",
        cancelText: "关闭",
        success: (res) => {
          if (res.confirm) {
            // 用户点击了分享按钮
            wx.showShareMenu({
              withShareTicket: true,
              menus: ["shareAppMessage", "shareTimeline"],
            });

            // 调用分享接口
            wx.shareAppMessage({
              title: "邀请您加入我的训练计划",
              desc: `请使用邀请码 ${inviteCode} 加入`,
              path: "/pages/join/join?inviteCode=" + inviteCode,
            });
          }

          // 无论用户是否分享，都刷新学员列表和统计数据
          this.fetchStudents(true);
          this.fetchStudentStats();
        },
      });
    }, 1000);
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
    } else if (tab === "training") {
      wx.redirectTo({ url: "/pages/training/training" });
    }
  },

  // 滚动到底部，加载更多
  onScrollToLower() {
    if (!this.data.isLoadingMore && this.data.pagination.hasMore) {
      this.fetchStudents(false);
    }
  },

  // 根据点击的统计卡片类型设置对应的筛选选项
  filterByType(e: any) {
    const type = e.currentTarget.dataset.type;
    let filterIndex = 0;

    // 根据点击的统计卡片类型设置对应的筛选选项
    switch (type) {
      case "all":
        filterIndex = 0; // 所有学员
        break;
      case "active":
        filterIndex = 1; // 活跃学员
        break;
      case "needAttention":
        filterIndex = 2; // 需要关注
        break;
      default:
        filterIndex = 0;
    }

    // 如果筛选条件没变，不重新加载
    if (this.data.filterIndex === filterIndex) return;

    // 更新筛选索引并重新加载数据
    this.setData({
      filterIndex,
    });

    // 重新加载学员数据
    this.fetchStudents(true);
  },

  // 在 Page 对象中添加分享方法
  onShareAppMessage(res: any) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      const inviteCode = res.target.dataset.inviteCode;
      return {
        title: "邀请您加入我的训练计划",
        desc: `请使用邀请码 ${inviteCode} 加入`,
        path: "/pages/join/join?inviteCode=" + inviteCode,
      };
    }

    // 来自菜单转发按钮
    return {
      title: "智能教练助手",
      path: "/pages/coachX/coachX",
    };
  },
});
