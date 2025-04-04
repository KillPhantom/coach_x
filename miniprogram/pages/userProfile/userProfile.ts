import { UserService, IUserInfo, ITag } from "../../services/userService";
import wxcharts from "../../utils/wxcharts.min.js";

// 为用户个人资料页扩展的用户信息接口
interface IExtendedUserInfo {
  name: string; // 用户真实姓名
  avatar: string; // 用户头像首字母或图片URL
  avatarStyle: string; // 头像样式（如背景色）
  role: string; // 角色: coach(教练) / student(学员)
  age?: number; // 年龄（学员特有）
  height?: number; // 身高（学员特有）
  weight?: number; // 体重（学员特有）
  tags: string[]; // 标签列表，如 "增肌", "减脂", "备赛"
  joinDate?: string; // 加入日期（学员特有）
  expirationDate?: string; // 会员到期日期（学员特有）
  coachName?: string; // 教练姓名（学员特有）
  coachId?: string; // 教练ID（学员特有）
  coachYears?: number; // 教练年限（教练特有）
}

// 训练统计数据
interface ITrainingStats {
  totalWorkouts: number; // 总训练次数
  completedWorkouts: number; // 已完成训练次数
  completionRate: string; // 训练完成率（百分比）
}

// 体重历史记录
interface IWeightRecord {
  date: string; // 记录日期 YYYY-MM-DD
  weight: number; // 体重值 (kg)
}

Page({
  data: {
    statusBarHeight: 0,
    user: {
      name: "",
      avatar: "",
      avatarStyle: "",
      role: "",
      age: 0,
      height: 0,
      weight: 0,
      tags: [],
      joinDate: "",
      expirationDate: "",
      coachName: "",
    } as IExtendedUserInfo,
    weightChange: "+0.0kg", // 体重变化（近6个月）
    stats: {
      totalWorkouts: 0,
      completedWorkouts: 0,
      completionRate: "0%",
    } as ITrainingStats,
    weightHistory: [] as IWeightRecord[],
    goals: ["增肌", "减脂", "备赛", "保持"],
    goalIndex: 0,
    today: "", // 今天的日期，用于日期选择器的起始值
    isDataChanged: false,
  },

  onLoad() {
    // 获取系统信息，设置状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;

    // 获取今天的日期（格式：YYYY-MM-DD）
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    this.setData({
      statusBarHeight,
      today: todayStr,
    });

    // 加载用户数据
    this.loadUserData();

    // 如果是学员，则加载训练统计数据和体重历史数据
    if (this.data.user.role === "student") {
      this.loadTrainingStats();
      this.loadWeightHistory();
    }
  },

  onShow() {
    // 如果数据可能有更新，刷新
    if (this.data.isDataChanged) {
      this.loadUserData();
      if (this.data.user.role === "student") {
        this.loadTrainingStats();
        this.loadWeightHistory();
      }
      this.setData({ isDataChanged: false });
    }
  },

  // 加载用户基本信息
  loadUserData() {
    // 从 UserService 获取用户信息
    const userInfo = UserService.getCurrentUser();
    if (!userInfo) {
      wx.redirectTo({ url: "/pages/login/login" });
      return;
    }

    // 转换为扩展用户信息
    const extendedUser = this.transformUserInfo(userInfo);
    this.setData({ user: extendedUser });

    // 设置目标的选择器索引
    if (extendedUser.tags && extendedUser.tags.length > 0) {
      const goalIndex = this.data.goals.findIndex((goal) =>
        extendedUser.tags.includes(goal)
      );
      if (goalIndex >= 0) {
        this.setData({ goalIndex });
      }
    }
  },

  // 将 IUserInfo 转换为 IExtendedUserInfo
  transformUserInfo(userInfo: IUserInfo): IExtendedUserInfo {
    const extendedUser: IExtendedUserInfo = {
      name: userInfo.nickName || "",
      avatar: userInfo.avatarUrl ? "" : this.getInitials(userInfo.nickName),
      avatarStyle: userInfo.avatarUrl
        ? `background-image: url('${userInfo.avatarUrl}');`
        : `background-color: ${this.getRandomColor(userInfo.nickName)};`,
      role: userInfo.role || "student",
      tags: userInfo.tags ? userInfo.tags.map((tag: ITag) => tag.tag) : [],
    };

    // 模拟数据 - 实际应该从服务器获取
    if (extendedUser.role === "student") {
      extendedUser.age = 28;
      extendedUser.height = 175;
      extendedUser.weight = 70;
      extendedUser.joinDate = "2023-01-01";
      extendedUser.expirationDate = "2024-12-31";
      extendedUser.coachName = "李教练";
    } else {
      extendedUser.coachYears = 5;
    }

    return extendedUser;
  },

  // 加载训练统计数据
  async loadTrainingStats() {
    try {
      // 模拟数据
      const stats: ITrainingStats = {
        totalWorkouts: 56,
        completedWorkouts: 48,
        completionRate: "85.7%",
      };

      this.setData({ stats });
    } catch (error) {
      console.error("获取训练统计数据失败:", error);
    }
  },

  // 加载体重历史数据
  async loadWeightHistory() {
    try {
      // 模拟6个月体重数据
      const today = new Date();
      const weightHistory: IWeightRecord[] = [];
      const currentWeight = this.data.user.weight || 70;

      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        // 随机生成在当前体重附近的历史数据
        const randomWeight = currentWeight + (Math.random() * 4 - 2);

        weightHistory.push({
          date: `${year}-${month}-${day}`,
          weight: Number(randomWeight.toFixed(1)),
        });
      }

      // 计算体重变化（最新体重 - 6个月前体重）
      if (weightHistory.length >= 2) {
        const latest = weightHistory[0].weight;
        const oldest = weightHistory[weightHistory.length - 1].weight;
        const change = latest - oldest;
        const changeText =
          change >= 0 ? `+${change.toFixed(1)}kg` : `${change.toFixed(1)}kg`;
        this.setData({ weightChange: changeText });
      }

      this.setData({ weightHistory });

      // 绘制体重变化图表
      this.drawWeightChart();
    } catch (error) {
      console.error("获取体重历史数据失败:", error);
    }
  },

  // 绘制体重变化图表
  drawWeightChart() {
    const history = this.data.weightHistory.slice().reverse(); // 时间顺序
    if (history.length === 0) return;

    const categories = history.map((record) => {
      const dateParts = record.date.split("-");
      return `${dateParts[1]}/${dateParts[2]}`; // 月/日
    });

    const data = history.map((record) => record.weight);

    try {
      // 使用wxcharts绘制体重变化图表
      new wxcharts({
        canvasId: "weightChart",
        type: "line",
        categories: categories,
        series: [
          {
            name: "体重",
            data: data,
            format: (val: number) => val.toFixed(1) + "kg",
          },
        ],
        yAxis: {
          title: "体重 (kg)",
          format: (val: number) => val.toFixed(0),
          min: Math.floor(Math.min(...data) - 1),
        },
        width: 320,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: "curve",
        },
      });
    } catch (error) {
      console.error("绘制图表失败:", error);
    }
  },

  // 返回上一页
  goBack() {
    if (this.data.isDataChanged) {
      wx.showModal({
        title: "保存更改",
        content: "您有未保存的更改，是否保存？",
        cancelText: "不保存",
        confirmText: "保存",
        success: (res) => {
          if (res.confirm) {
            this.saveChanges().then(() => {
              wx.navigateBack();
            });
          } else {
            wx.navigateBack();
          }
        },
      });
    } else {
      wx.navigateBack();
    }
  },

  // 更新年龄值
  onAgeChange(e: WechatMiniprogram.Input) {
    const age = parseInt(e.detail.value);
    if (!isNaN(age) && age > 0) {
      this.setData({
        "user.age": age,
        isDataChanged: true,
      });
    }
  },

  // 更新身高值
  onHeightChange(e: WechatMiniprogram.Input) {
    const height = parseFloat(e.detail.value);
    if (!isNaN(height) && height > 0) {
      this.setData({
        "user.height": height,
        isDataChanged: true,
      });
    }
  },

  // 更新体重值
  onWeightChange(e: WechatMiniprogram.Input) {
    const weight = parseFloat(e.detail.value);
    if (!isNaN(weight) && weight > 0) {
      this.setData({
        "user.weight": weight,
        isDataChanged: true,
      });
    }
  },

  // 更新目标
  onGoalChange(e: WechatMiniprogram.PickerChange) {
    const goalIndex = parseInt(e.detail.value);
    const selectedGoal = this.data.goals[goalIndex];

    // 更新目标标签
    const tags = [...this.data.user.tags];
    // 移除现有的目标标签
    const filteredTags = tags.filter((tag) => !this.data.goals.includes(tag));
    // 添加新选择的目标
    filteredTags.push(selectedGoal);

    this.setData({
      goalIndex,
      "user.tags": filteredTags,
      isDataChanged: true,
    });
  },

  // 更新到期日期
  onExpirationDateChange(e: WechatMiniprogram.PickerChange) {
    this.setData({
      "user.expirationDate": e.detail.value,
      isDataChanged: true,
    });
  },

  // 保存更改
  async saveChanges() {
    wx.showLoading({ title: "保存中..." });

    try {
      // 获取现有用户信息
      const userInfo = UserService.getCurrentUser();
      if (!userInfo) {
        throw new Error("用户信息不存在");
      }

      // 更新用户信息 - 这里应该调用后端接口更新用户数据
      // 作为示例，我们只更新本地存储
      // 实际应用中应该使用云函数将更改保存到数据库

      // 转换标签格式
      const updatedTags = this.data.user.tags.map((tag) => {
        let tagClass = "tag-default";
        switch (tag) {
          case "增肌":
            tagClass = "tag-bulking";
            break;
          case "减脂":
            tagClass = "tag-cutting";
            break;
          case "备赛":
            tagClass = "tag-compete";
            break;
        }
        return { tag, tagClass };
      });

      // 更新用户信息
      const updatedUserInfo: IUserInfo = {
        ...userInfo,
        tags: updatedTags,
      };

      // 保存到本地
      UserService.saveUserInfo(updatedUserInfo);

      // 将更新数据标志重置
      this.setData({ isDataChanged: false });

      // 显示成功提示
      wx.hideLoading();
      wx.showToast({
        title: "保存成功",
        icon: "success",
      });

      return true;
    } catch (error) {
      console.error("保存用户信息失败:", error);
      wx.hideLoading();
      wx.showToast({
        title: "保存失败",
        icon: "error",
      });
      return false;
    }
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: "退出登录",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          // 调用 UserService 的 logout 方法
          UserService.logout();
          // 跳转到登录页
          wx.reLaunch({
            url: "/pages/login/login",
          });
        }
      },
    });
  },

  // 获取姓名首字母作为头像显示
  getInitials(name: string): string {
    if (!name) return "?";
    // 提取中文姓名的第一个字或者英文名的首字母
    return name.charAt(0).toUpperCase();
  },

  // 根据用户名生成随机背景色
  getRandomColor(name: string): string {
    const colors = [
      "#1ABC9C",
      "#2ECC71",
      "#3498DB",
      "#9B59B6",
      "#34495E",
      "#16A085",
      "#27AE60",
      "#2980B9",
      "#8E44AD",
      "#2C3E50",
      "#F1C40F",
      "#E67E22",
      "#E74C3C",
      "#D35400",
      "#C0392B",
    ];

    // 使用用户名的字符码之和来确定颜色索引，确保同一用户始终获得相同颜色
    if (!name) return colors[0];

    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }

    return colors[sum % colors.length];
  },
});
