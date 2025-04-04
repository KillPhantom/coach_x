import {
  FetchStudentsService,
  IPagination,
} from "../../services/fetchStudentsService";
import { IUserInfo } from "../../services/userService";

interface StudentStats {
  total: number;
  active: number;
  needAttention: number;
}

Page({
  data: {
    statusBarHeight: 0,
    filterOptions: ["所有学员", "活跃学员", "需要关注", "需要回复"],
    filterIndex: 0,
    searchText: "",
    stats: {} as StudentStats,
    loading: false,
    students: [] as IUserInfo[],
    pagination: {
      total: 0,
      pageSize: 30,
      pageNumber: 1,
      totalPages: 0,
    } as IPagination,
    scrollHeight: 0,
    hasMore: true,
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
    this.fetchStudents();
  },

  onShow() {
    // 确保正确设置当前页面的 tab 索引为 2 (训练计划)
    if (typeof this.getTabBar === "function") {
      this.getTabBar().setData({
        selected: 1, // 训练计划页面的索引
      });
    }
    // 如果页面重新显示，检查缓存是否过期
    if (!FetchStudentsService.isCacheValid()) {
      this.fetchStudents();
    } else {
      // 使用缓存更新UI
      this.setData({
        students: FetchStudentsService.getCachedStudents(),
        pagination: FetchStudentsService.getPagination(),
      });
    }
  },

  // 获取学员统计数据
  async fetchStudentStats() {
    try {
      this.setData({
        "loading.stats": true,
      });
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
  async fetchStudents() {
    this.setData({ loading: true, error: "" });
    try {
      const result = await FetchStudentsService.fetchStudents();
      this.setData({
        students: result.students,
        pagination: result.pagination,
        loading: false,
        hasMore: result.pagination.totalPages > result.pagination.pageNumber,
      });
      console.log("page data is", this.data);
    } catch (err) {
      this.setData({
        loading: false,
        error: "加载学生列表失败",
      });
    }
    console.log("students", this.data.students);
  },

  generateMockedStudents(count: number, startId: number) {
    const students = [];
    const statuses = ["活跃", "需要关注", "需要回复", "新学员"];
    const tags = ["增肌期", "减脂期", "维持期"];
    const tagClasses = ["tag-bulking", "tag-cutting", "tag-maintenance"];

    for (let i = 0; i < count; i++) {
      const id = startId + i;
      const name = `学员${id}`;
      const statusIndex = Math.floor(Math.random() * 4);
      const tagIndex = Math.floor(Math.random() * 3);

      students.push({
        id,
        name,
        avatar: name.substring(0, 1),
        avatarStyle: "",
        status: statuses[statusIndex],
        statusStyle:
          statusIndex === 1
            ? "color: #ff4d4f;"
            : statusIndex === 2
            ? "color: #f5222d;"
            : "",
        tag: tags[tagIndex],
        tagClass: tagClasses[tagIndex],
      });
    }
    return students;
  },

  // 搜索输入
  onSearchInput(e: any) {
    const searchText = e.detail.value;
    // 如果有搜索文本，模拟过滤
    if (searchText) {
      const filteredStudents = this.data.students.filter((student) =>
        student.nickName.includes(searchText)
      );
      this.setData({ students: filteredStudents });
    }
  },

  // 过滤选择
  onFilterChange(e: any) {
    this.setData({
      filterIndex: e.detail.value,
    });

    // 切换筛选条件后重新加载数据
    this.fetchStudents();
  },

  // 添加新学员
  addNewStudent() {
    // 显示加载中
    wx.showLoading({
      title: "生成邀请码...",
      mask: true,
    });

    wx.cloud.callFunction({
      name: "generateStudentInvitationCode",
      data: {},
      success: (res: any) => {
        if (res.result.success) {
          wx.showModal({
            title: "添加新学员",
            content: `邀请码已生成: ${res.result.code}\n您可以将此邀请码分享给学员`,
            confirmText: "分享",
            cancelText: "关闭",
            success: (res) => {
              if (res.confirm) {
                // 用户点击了分享按钮
                wx.showShareMenu({
                  withShareTicket: true,
                  menus: ["shareAppMessage"],
                });
              }
              // 无论用户是否分享，都刷新学员列表和统计数据
            },
          });
        } else {
          // 显示失败消息
          wx.showModal({
            title: "生成失败",
            content: res.result.message || "未知错误",
            showCancel: false,
          });
        }
      },
      fail: (err) => {
        console.error("生成邀请码失败", err);
        wx.showModal({
          title: "操作失败",
          content: "生成邀请码时发生错误，请稍后再试",
          showCancel: false,
        });
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  },

  onScrollToLower() {
    if (!this.data.loading && this.data.hasMore) {
      this.fetchStudents();
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
      case "needReply":
        filterIndex = 3; // 需要回复
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
    this.fetchStudents();
  },

  async refreshList() {
    console.log("refreshList was clicked");
    this.setData({ loading: true, error: "" });
    try {
      const result = await FetchStudentsService.refreshStudents();
      this.setData({
        students: result.students,
        pagination: result.pagination,
        loading: false,
      });
    } catch (err) {
      this.setData({
        loading: false,
      });
    }
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

  // 显示学员操作选项
  showStudentOptions(e: any) {
    const studentId = e.currentTarget.dataset.studentId;

    wx.showActionSheet({
      itemList: ["查看学员详情", "编辑计划", "删除学员"],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            // 查看学员详情
            this.viewStudentDetail(studentId);
            break;
          case 1:
            // 邀请加入群聊
            this.editStudentPlan(studentId);
            break;
          case 2:
            // 删除学员
            this.deleteStudent(studentId);
            break;
        }
      },
    });
  },

  // 搜索学员
  searchStudents() {
    // 直接使用当前输入框中的文本进行搜索
    this.fetchStudents();
    // 收起键盘
    wx.hideKeyboard();
  },

  // 添加学员卡片点击事件处理函数
  onStudentCardTap(e: any) {
    const studentId = e.currentTarget.dataset.openid;
    if (!studentId) {
      console.error("No student ID found");
      return;
    }
    wx.navigateTo({
      url: `/pages/todayTraining/todayTraining?id=${studentId}`,
      fail: (err) => {
        console.error("导航到今日训练详情页面失败:", err);
        wx.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  },

  // 添加查看学员详情的函数
  viewStudentDetail(studentId: number) {
    wx.navigateTo({
      url: `../studentDetail/studentDetail?id=${studentId}`,
      fail: (err) => {
        console.error("导航到学员详情页面失败:", err);
        wx.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  },

  // 添加查看学员详情的函数
  editStudentPlan(studentId: number) {
    wx.navigateTo({
      url: `../planDetail/planDetail?id=${studentId}`,
      fail: (err) => {
        console.error("导航到学员计划页面失败:", err);
        wx.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  },

  // 添加删除学员的函数
  deleteStudent(studentId: number) {
    wx.showModal({
      title: "确认删除",
      content: "确定要删除该学员吗？此操作不可撤销。",
      confirmColor: "#f5222d",
      success: (res) => {
        if (res.confirm) {
          // 实际应用中应该调用API删除学员
          // request({
          //   url: `/api/students/${studentId}`,
          //   method: 'DELETE'
          // }).then(() => {
          //   this.fetchStudents(true);
          //   this.fetchStudentStats();
          // });

          // 模拟删除操作
          wx.showToast({
            title: "删除成功",
            icon: "success",
          });

          // 刷新学员列表和统计数据
          this.fetchStudents();
          this.fetchStudentStats();
        }
      },
    });
  },
});
