// 学员详情页面

import { UserService } from "../../services/userService";

interface Measurement {
  label: string;
  value: string;
  change: string;
  changeClass: string;
}

Page({
  data: {
    statusBarHeight: 0,
    student: {
      openId: "",
      name: "",
      bornDate: "",
      goal: "",
      height: "",
      joinDate: "",
      expirationDate: "",
      avatar: "",
      avatarStyle: "",
    },
    weightData: [
      { month: "10月", weight: 78 },
      { month: "11月", weight: 76 },
      { month: "12月", weight: 75 },
      { month: "1月", weight: 73 },
      { month: "2月", weight: 72 },
      { month: "3月", weight: 71 },
    ],
    weightChange: "-7kg",
    currentWeight: 71,
    weightMonthChange: "-1kg",
    bodyFatPercentage: 18.5,
    bodyFatChange: "-0.8%",
    bmr: 1720,
    bmrChange: "+25",
    measurements: [] as Measurement[],
    chart: null,
    isCurrentUser: false, // 是否为当前用户查看自己的资料
    isEditing: false, // 是否处于编辑模式
    today: "", // 今天的日期，用于日期选择器
  },

  onLoad() {
    // 获取当前日期（用于日期选择器的结束日期）
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    // 设置状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;

    // 初始化数据
    this.setData({
      statusBarHeight,
      today: todayStr,
    });

    const open_id = "123";
    if (open_id) {
      this.loadStudentData(open_id);
    } else {
      wx.showToast({
        title: "学员ID不存在",
        icon: "none",
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 加载学员数据
  async loadStudentData(studentId: string) {
    try {
      // 获取当前用户信息

      // // 查询学员详情
      // const res = await wx.cloud.callFunction({
      //   name: "getStudentDetail",
      //   data: { studentId },
      // });
      // const studentData = res.result.data;
      const studentData = null;

      this.setData({
        student: {
          openId: studentId,
          name: "张伟",
          avatar: "张",
          avatarStyle: "background-color: #1890ff; color: white;",
          bornDate: "1990-01-01",
          height: "178",
          joinDate: "2023-12-15",
          expirationDate: "2024-06-15",
          goal: "减脂增肌",
        },
        isCurrentUser: true,
      });

      // 加载其他数据
      this.loadWeightData(studentId);
      this.loadMeasurementsData(studentId);
      if (studentData) {
        // 计算是否为当前用户查看自己的资料
        const isCurrentUser =
          currentUser && currentUser.openId === studentData.openId;
        this.setData({
          isCurrentUser,
        });
      }
    } catch (error) {
      console.error("获取学员数据失败:", error);
      wx.showToast({
        title: "获取数据失败",
        icon: "none",
      });
    }
  },

  // 切换编辑模式
  toggleEditMode() {
    const isEditing = !this.data.isEditing;
    this.setData({ isEditing });

    // 如果从编辑模式切换回查看模式，保存修改
    if (!isEditing) {
      this.saveUserInfo();
    }
  },

  // 处理出生日期修改
  onBornDateChange(e: any) {
    this.setData({
      "student.bornDate": e.detail.value,
    });
  },

  // 处理身高修改
  onHeightChange(e: any) {
    const height = e.detail.value;
    // 验证输入是否为有效数字
    if (!isNaN(Number(height))) {
      this.setData({
        "student.height": height,
      });
    }
  },

  // 保存用户信息
  async saveUserInfo() {
    try {
      wx.showLoading({ title: "保存中..." });

      const { bornDate, height } = this.data.student;

      // 调用云函数更新用户信息
      await wx.cloud.callFunction({
        name: "updateUserInfo",
        data: {
          bornDate,
          height: Number(height),
        },
      });

      wx.hideLoading();
      wx.showToast({
        title: "保存成功",
        icon: "success",
      });
    } catch (error) {
      console.error("保存失败:", error);
      wx.hideLoading();
      wx.showToast({
        title: "保存失败",
        icon: "error",
      });
    }
  },

  // 初始化身体围度数据
  initMeasurements() {
    const currentData = {
      chest: 96,
      waist: 83,
      hip: 98,
      arm: 35,
      thigh: 54,
    };

    const previousData = {
      chest: 98,
      waist: 88,
      hip: 100,
      arm: 34,
      thigh: 56,
    };

    const labels = {
      chest: "胸围",
      waist: "腰围",
      hip: "臀围",
      arm: "上臂围",
      thigh: "大腿围",
    };

    const measurements: Measurement[] = [];

    for (const [key, value] of Object.entries(currentData)) {
      const previousValue = previousData[key];
      const change = this.calculateChange(value, previousValue);
      const changeClass = this.getChangeColorClass(key, change);

      measurements.push({
        label: labels[key],
        value: value.toString(),
        change,
        changeClass,
      });
    }

    this.setData({
      measurements,
    });
  },

  // 计算变化百分比
  calculateChange(current: number, previous: number): string {
    const change = (((current - previous) / previous) * 100).toFixed(1);
    return parseFloat(change) > 0 ? `+${change}%` : `${change}%`;
  },

  // 确定变化的颜色类名
  getChangeColorClass(metric: string, change: string): string {
    if (metric === "chest" || metric === "arm") {
      return parseFloat(change) > 0 ? "change-positive" : "change-negative";
    } else {
      return parseFloat(change) < 0 ? "change-positive" : "change-negative";
    }
  },

  // 初始化体重变化图表
  initChart() {
    const query = wx.createSelectorQuery();
    query
      .select("#weightChart")
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");

        // 获取设备像素比以支持高清屏
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const data = this.data.weightData;
        const width = res[0].width;
        const height = res[0].height;

        // 设置画布背景
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // 计算图表区域
        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // 计算数据范围
        const weights = data.map((item) => item.weight);
        const maxWeight = Math.max(...weights) + 2;
        const minWeight = Math.min(...weights) - 2;
        const weightRange = maxWeight - minWeight;

        // 绘制X轴
        ctx.beginPath();
        ctx.strokeStyle = "#e0e0e0";
        ctx.moveTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.stroke();

        // 绘制Y轴
        ctx.beginPath();
        ctx.strokeStyle = "#e0e0e0";
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.stroke();

        // 绘制Y轴标签
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#999999";

        // 绘制3-4个Y轴标签
        const yLabelCount = 4;
        for (let i = 0; i <= yLabelCount; i++) {
          const yValue = minWeight + (weightRange * i) / yLabelCount;
          const y = height - padding.bottom - (chartHeight * i) / yLabelCount;

          // 绘制网格线
          ctx.beginPath();
          ctx.strokeStyle = "#f0f0f0";
          ctx.moveTo(padding.left, y);
          ctx.lineTo(width - padding.right, y);
          ctx.stroke();

          // 绘制标签
          ctx.fillText(yValue.toFixed(0) + "kg", padding.left - 30, y + 3);
        }

        // 绘制X轴标签
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#999999";
        data.forEach((item, index) => {
          const x = padding.left + (chartWidth / (data.length - 1)) * index;
          ctx.fillText(item.month, x - 10, height - padding.bottom + 15);
        });

        // 绘制折线
        ctx.beginPath();
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;

        data.forEach((item, index) => {
          const x = padding.left + (chartWidth / (data.length - 1)) * index;
          const y =
            padding.top +
            chartHeight -
            ((item.weight - minWeight) / weightRange) * chartHeight;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();

        // 绘制数据点和标签
        data.forEach((item, index) => {
          const x = padding.left + (chartWidth / (data.length - 1)) * index;
          const y =
            padding.top +
            chartHeight -
            ((item.weight - minWeight) / weightRange) * chartHeight;

          // 绘制数据点
          ctx.beginPath();
          ctx.fillStyle = "#2563eb";
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = "#ffffff";
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // 绘制体重数值标签
          ctx.font = "10px sans-serif";
          ctx.fillStyle = "#2563eb";
          ctx.fillText(item.weight + "kg", x - 10, y - 10);
        });
      });
  },

  // 返回上一页
  goBack() {
    console.log("返回按钮被点击");
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        console.error("返回上一页失败:", err);
        // 如果返回失败，则导航到学员列表页面
        wx.redirectTo({
          url: "../students/students",
          fail: (switchErr) => {
            console.error("切换到学员页面失败:", switchErr);
            // 最后的备选方案，导航到首页
            wx.redirectTo({
              url: "../coachX/coachX",
            });
          },
        });
      },
    });
  },

  // 实际应用中从服务器获取学员详情
  fetchStudentDetail(studentId: string) {
    // 实际应用中应该从服务器获取数据
    // wx.request({
    //   url: `https://api.example.com/students/${studentId}`,
    //   success: (res) => {
    //     this.setData({
    //       student: res.data.student,
    //       weightData: res.data.weightData,
    //       // ...其他数据
    //     });
    //     this.initMeasurements();
    //     this.initChart();
    //   }
    // });
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

  // 加载体重历史数据
  async loadWeightData(studentId: string) {
    try {
      // 实际应用中应该从服务器获取数据
      // 这里使用模拟数据
      const weightData = [
        { month: "10月", weight: 78.5 },
        { month: "11月", weight: 76.2 },
        { month: "12月", weight: 75.0 },
        { month: "1月", weight: 74.5 },
        { month: "2月", weight: 73.8 },
        { month: "3月", weight: 72.5 },
      ];

      this.setData({ weightData });
      this.initChart();
    } catch (error) {
      console.error("获取体重数据失败:", error);
    }
  },

  // 加载身体围度数据
  async loadMeasurementsData(studentId: string) {
    try {
      // 实际应用中应该从服务器获取数据
      // 这里使用模拟数据
      const measurements = [
        {
          label: "胸围",
          value: "98cm",
          change: "+2cm",
          changeClass: "change-positive",
        },
        {
          label: "腰围",
          value: "82cm",
          change: "-3cm",
          changeClass: "change-negative",
        },
        {
          label: "臀围",
          value: "95cm",
          change: "+1cm",
          changeClass: "change-positive",
        },
        {
          label: "手臂围",
          value: "36cm",
          change: "+1.5cm",
          changeClass: "change-positive",
        },
        {
          label: "大腿围",
          value: "58cm",
          change: "+1cm",
          changeClass: "change-positive",
        },
      ];

      this.setData({ measurements });
    } catch (error) {
      console.error("获取身体围度数据失败:", error);
    }
  },
});
