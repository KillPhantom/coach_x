// At the top, import UserService
import { UserService, IUserInfo } from "../../services/userService";

Page({
  data: {
    isLoggedIn: false,
    hasValidInvitation: false,
    userInfo: {
      nickName: "",
      avatarUrl: "",
      gender: 0,
      province: "",
      city: "",
      country: "",
      openId: "",
      isVerified: false,
      isAdmin: false,
      role: "",
      isDemoUser: false,
    },
    invitationCode: "",
  },
  onLoad() {
    // Check if user is logged in using UserService
    const userInfo = UserService.getCurrentUser();
    console.log("userInfo is ", userInfo);
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
      });
    }
  },

  // 邀请码输入处理
  onInvitationCodeInput(e: any) {
    this.setData({
      invitationCode: e.detail.value,
    });
  },

  // 验证邀请码
  verifyInvitationCode() {
    const { invitationCode } = this.data;

    if (!invitationCode) {
      wx.showToast({
        title: "请输入邀请码",
        icon: "none",
      });
      return;
    }

    // 显示加载中
    wx.showLoading({
      title: "验证中...",
    });

    // 调用云函数验证邀请码 - 注意不再需要传递openid，云函数会自动获取
    wx.cloud.callFunction({
      name: "verifyInvitationCode",
      data: {
        code: invitationCode,
        open_id: this.data.userInfo.openId,
      },
      success: (res: any) => {
        console.log("验证结果", res.result);
        if (res.result && res.result.valid) {
          // Get existing user info
          const userInfo = UserService.getCurrentUser();
          // Update properties
          userInfo.role = res.result.role;
          userInfo.isVerified = true;
          // Save with UserService
          UserService.saveUserInfo(userInfo);

          // Show toast and redirect...
          wx.showToast({
            title: "邀请码验证成功",
            icon: "success",
          });

          // 短暂延迟后跳转
          setTimeout(() => {
            this.redirectToHome();
          }, 1500);
        } else {
          // 邀请码无效
          wx.showToast({
            title: res.result.message || "邀请码无效",
            icon: "none",
          });
        }
      },
      fail: (err) => {
        console.error("验证邀请码失败", err);
        wx.showToast({
          title: "验证失败，请重试",
          icon: "none",
        });
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: "确认退出",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          // Use UserService to log out
          UserService.logout();

          this.setData({
            isLoggedIn: false,
            hasValidInvitation: false,
            userInfo: {
              nickName: "",
              avatarUrl: "",
              gender: 0,
              province: "",
              city: "",
              country: "",
              openId: "",
              isVerified: false,
              isAdmin: false,
              role: "",
              isDemoUser: false,
            },
            invitationCode: "",
          });
        }
      },
    });
  },

  // 微信登录处理
  onGetUserInfo(e: any) {
    if (e.detail.userInfo) {
      // 用户同意授权
      const userInfo = e.detail.userInfo;
      // 调用登录接口
      wx.login({
        success: (res) => {
          if (res.code) {
            // 获取code成功，调用后端接口获取openId
            this.loginWithOpenId(res.code, userInfo);
          } else {
            wx.showToast({
              title: "登录失败，请重试",
              icon: "none",
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: "登录失败，请重试",
            icon: "none",
          });
        },
      });
    } else {
      // 用户拒绝授权
      wx.showToast({
        title: "需要授权才能使用完整功能",
        icon: "none",
      });
    }
  },

  // 使用code登录
  loginWithOpenId(code: string, userInfo: any) {
    // 显示加载中
    wx.showLoading({
      title: "登录中...",
    });

    // 调用后端登录接口
    wx.cloud.callFunction({
      name: "login",
      data: {
        code: code,
        userInfo: userInfo,
      },
      success: (res: any) => {
        console.log("loginWithOpenId res is ", res.result);
        const { open_id, is_admin, is_verified, role } = res.result;
        // Update user info
        console.log("open_id is ", open_id);
        userInfo.openId = open_id;
        userInfo.isVerified = is_verified || false;
        userInfo.isAdmin = is_admin || false;
        userInfo.role = role || "student";

        console.log("userInfo is ", userInfo);
        // Use UserService to save the user info
        UserService.saveUserInfo(userInfo as IUserInfo);

        this.redirectToHome();

        this.setData({
          isLoggedIn: true,
          userInfo: userInfo,
        });
      },
      fail: (err) => {
        console.error("登录失败", err);
        wx.showToast({
          title: "登录失败，请重试",
          icon: "none",
        });
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  },

  // 跳转到首页
  redirectToHome() {
    // Get user role from UserService
    const role = "coach"; // UserService.getUserRole();
    console.log("trying to redirect to home ", role);

    if (role === "coach") {
      wx.switchTab({
        url: "/pages/coachX/coachX",
      });
    } else {
      wx.navigateTo({
        url: "/pages/student/student",
      });
    }
  },

  // 显示隐私政策
  showPrivacyPolicy() {
    wx.navigateTo({
      url: "/pages/privacyPolicy/privacyPolicy",
    });
  },

  // 生成邀请码 (管理员功能)
  generateInvitationCodes() {
    // 显示加载中提示
    wx.showLoading({
      title: "生成中...",
      mask: true,
    });

    // 调用云函数
    wx.cloud.callFunction({
      name: "generateInvitationCodes",
      data: {
        codeCount: 50, // 生成数量
        codeType: 1, // 默认为类型1
      },
      success: (res: any) => {
        console.log("生成邀请码成功", res.result);

        if (res.result.success) {
          // 显示成功消息
          wx.showModal({
            title: "生成成功",
            content: `成功生成${
              res.result.message
            }。\n\n前10个邀请码：\n${res.result.firstTenCodes.join("\n")}`,
            showCancel: false,
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
});
