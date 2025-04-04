import { DateUtils } from "../utils/dateUtils";

// Define user interface
export interface IUserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  isVerified: boolean;
  isAdmin: boolean;
  role: string;
  isDemoUser: boolean;
  tags: ITag[];
  coachId: string;
  lastActiveTime?: string; // 相对时间（几天前、几小时前）
  openId: string;
}

export interface ITag {
  tag: string;
  tagClass: string;
}

// User service for managing user data
export class UserService {
  // Get current user info
  static getCurrentUser(): IUserInfo {
    return wx.getStorageSync("userInfo");
  }

  // Save user info
  static saveUserInfo(userInfo: IUserInfo): void {
    wx.setStorageSync("userInfo", userInfo);
    // Also update global data if needed
    const app = getApp();
    if (app.globalData) {
      app.globalData.userInfo = userInfo;
    }
  }

  // Check if user is logged in
  static isLoggedIn(): boolean {
    const userInfo = this.getCurrentUser();
    return !!userInfo && !!userInfo.openId;
  }

  // Check if user is verified
  static isVerified(): boolean {
    const userInfo = this.getCurrentUser();
    return !!userInfo && !!userInfo.isVerified;
  }

  // Get user role
  static getUserRole(): string {
    const userInfo = this.getCurrentUser();
    return userInfo?.role || "";
  }

  static parseUserInfo(userInfo: any): IUserInfo {
    // 处理标签翻译
    let processedTags: ITag[] = [];

    // 检查tags是否存在且为数组
    if (userInfo.tags && Array.isArray(userInfo.tags)) {
      processedTags = userInfo.tags.map((tag: string) => {
        // 标签翻译逻辑
        switch (tag) {
          case "增肌":
            return { tag: "增肌", tagClass: "tag-bulking" };
          case "减脂":
            return { tag: "减脂", tagClass: "tag-cutting" };
          case "备赛":
            return { tag: "备赛", tagClass: "tag-compete" };
          default:
            return { tag: tag, tagClass: "tag-default" };
        }
      });
    }

    // 处理最后活跃时间
    const timestamp = userInfo.last_active_time;

    // 计算相对时间（几天前、几小时前等）
    const relativeTime = DateUtils.formatRelativeTime(timestamp);

    return {
      nickName: userInfo.name,
      avatarUrl: userInfo.avatar_url,
      gender: userInfo.gender,
      openId: userInfo.open_id || userInfo.openId,
      isVerified: userInfo.is_verified,
      tags: processedTags,
      coachId: userInfo.coach_id,
      isDemoUser: false,
      isAdmin: userInfo.is_admin,
      role: userInfo.role,
      lastActiveTime: relativeTime, // 添加相对时间字段
    };
  }

  // Logout
  static logout(): void {
    // wx.removeStorageSync("userInfo");
    // // Clear global data if needed
    // const app = getApp();
    // if (app.globalData) {
    //   app.globalData.userInfo = null;
    // }
  }
}
