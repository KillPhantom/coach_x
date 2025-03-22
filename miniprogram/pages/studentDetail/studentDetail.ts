// 学员详情页面
import * as echarts from "../../components/ec-canvas/echarts";

interface Measurement {
  label: string;
  value: number;
  change: string;
  changeClass: string;
}

Page({
  data: {
    statusBarHeight: 40,
    student: {
      id: 1,
      name: "张伟",
      avatar: "张",
      avatarStyle: "background-color: #1890ff; color: white;",
      age: 28,
      height: 178,
      joinDate: "2023-12-15",
      expirationDate: "2024-06-15",
      goal: "减脂增肌",
      nextSession: "2023-03-22",
      contact: "186****7890",
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
  },

  onLoad(options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;

    // 设置状态栏高度
    this.setData({
      statusBarHeight: statusBarHeight,
    });

    // 获取学员ID
    const studentId = options.id;

    // 实际应用中应该从服务器获取学员详情数据
    // this.fetchStudentDetail(studentId);

    // 模拟数据
    this.initMeasurements();

    // 初始化图表
    this.initChart();
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
        value,
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
    const ctx = wx.createCanvasContext("weightChart");
    const data = this.data.weightData;

    // 计算画布尺寸
    const query = wx.createSelectorQuery();
    query.select(".chart-container").boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        const width = res[0].width;
        const height = res[0].height;

        // 设置画布背景
        ctx.setFillStyle("#ffffff");
        ctx.fillRect(0, 0, width, height);

        // 计算图表区域
        const padding = { top: 20, right: 20, bottom: 30, left: 40 }; // 增加左侧padding以容纳Y轴标签
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // 计算数据范围
        const weights = data.map((item) => item.weight);
        const maxWeight = Math.max(...weights) + 2;
        const minWeight = Math.min(...weights) - 2;
        const weightRange = maxWeight - minWeight;

        // 绘制X轴
        ctx.beginPath();
        ctx.setStrokeStyle("#e0e0e0");
        ctx.moveTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.stroke();

        // 绘制Y轴
        ctx.beginPath();
        ctx.setStrokeStyle("#e0e0e0");
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.stroke();

        // 绘制Y轴标签
        ctx.setFontSize(10);
        ctx.setFillStyle("#999999");

        // 绘制3-4个Y轴标签
        const yLabelCount = 4;
        for (let i = 0; i <= yLabelCount; i++) {
          const yValue = minWeight + (weightRange * i) / yLabelCount;
          const y = height - padding.bottom - (chartHeight * i) / yLabelCount;

          // 绘制网格线
          ctx.beginPath();
          ctx.setStrokeStyle("#f0f0f0");
          ctx.moveTo(padding.left, y);
          ctx.lineTo(width - padding.right, y);
          ctx.stroke();

          // 绘制标签
          ctx.fillText(yValue.toFixed(0) + "kg", padding.left - 30, y + 3);
        }

        // 绘制X轴标签
        ctx.setFontSize(10);
        ctx.setFillStyle("#999999");
        data.forEach((item, index) => {
          const x = padding.left + (chartWidth / (data.length - 1)) * index;
          ctx.fillText(item.month, x - 10, height - padding.bottom + 15);
        });

        // 绘制折线
        ctx.beginPath();
        ctx.setStrokeStyle("#2563eb");
        ctx.setLineWidth(2);

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
          ctx.setFillStyle("#2563eb");
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.setFillStyle("#ffffff");
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // 绘制体重数值标签
          ctx.setFontSize(10);
          ctx.setFillStyle("#2563eb");
          ctx.fillText(item.weight + "kg", x - 10, y - 10);
        });

        ctx.draw();
      }
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
});
