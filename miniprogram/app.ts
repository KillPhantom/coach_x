import { IUserInfo } from "./services/userService";

interface IGlobalData {
  userInfo: IUserInfo | null;
  statusBarHeight: number;
  [key: string]: any;
}

App<{
  globalData: IGlobalData;
}>({
  globalData: {
    userInfo: null,
    statusBarHeight: 0,
  },

  onLaunch() {
    // Initialize cloud
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      try {
        wx.cloud.init({
          env: "cloud1-9ge9zkm3cd1d376e",
          traceUser: true,
        });
      } catch (e) {
        console.log("云环境可能已经初始化", e);
      }
    }

    // Load user info from storage to global data
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }

    // Get system info
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;

    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
  },
});
