Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#07C160",
    list: [
      {
        pagePath: "/pages/coachX/coachX",
        text: "首页",
        iconPath: "../images/icons/home.png",
        selectedIconPath: "../images/icons/home.png",
      },
      {
        pagePath: "/pages/students/students",
        text: "学员",
        iconPath: "../images/icons/student.png",
        selectedIconPath: "../images/icons/student.png",
      },
      {
        pagePath: "/pages/training/training",
        text: "训练计划",
        iconPath: "../images/icons/plan.png",
        selectedIconPath: "../images/icons/plan.png",
      },
    ],
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url,
      });
      this.setData({
        selected: data.index,
      });
    },
  },
});
