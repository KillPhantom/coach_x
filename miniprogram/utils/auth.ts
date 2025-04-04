import { UserService } from "../services/userService";

// 检查云环境是否初始化
export function ensureCloudInitialized() {
  if (!wx.cloud) {
    console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    return false;
  }

  try {
    // 尝试初始化云环境
    wx.cloud.init({
      env: "cloud1-9ge9zkm3cd1d376e", // 使用您的实际云环境ID
      traceUser: true,
    });
  } catch (e) {
    // 可能已经初始化过了，忽略错误
    console.log("云环境可能已经初始化", e);
  }

  return true;
}

// 检查用户是否已登录
export function checkLogin(): boolean {
  return UserService.isLoggedIn();
}

// 重定向到登录页面
export function redirectToLogin() {
  wx.redirectTo({
    url: "/pages/login/login",
  });
}

// 获取用户信息
export function getUserInfo() {
  return wx.getStorageSync("userInfo");
}

// 检查用户权限
export function checkUserRole(targetRole: string): Promise<boolean> {
  if (!ensureCloudInitialized()) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: "getUserRole",
      success: (res: any) => {
        const { role } = res.result;
        resolve(role === targetRole);
      },
      fail: () => {
        resolve(false);
      },
    });
  });
}

// 退出登录
export function logout() {
  wx.clearStorageSync();
  redirectToLogin();
}

// Check if user is verified
export function checkVerified(): boolean {
  return UserService.isVerified();
}

// Check user role
export function isCoach(): boolean {
  return UserService.getUserRole() === "coach";
}

// Get current user
export function getCurrentUser() {
  return UserService.getCurrentUser();
}
