// 云函数入口文件
const cloudbase = require("@cloudbase/node-sdk");
const cloud = require("wx-server-sdk");
const crypto = require("crypto");

// 云函数入口函数
exports.main = async (event, context) => {
  const app = cloudbase.init({
    env: "cloud1-9ge9zkm3cd1d376e", // 请替换为您的云环境ID
    context: context,
  });
  // 获取当前登录教练的 openid
  const { OPENID } = cloud.getWXContext();
  // 初始化数据库
  try {
    const models = app.models;
    // 生成随机邀请码
    const timestamp = Date.now().toString();
    const uniqueInput = `${timestamp}-${OPENID}-${Math.random()}`;
    const hash = crypto.createHash("sha256").update(uniqueInput).digest("hex");

    // 生成8位邀请码，格式为 XXXX-XXXX
    const allowedChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < 8; i++) {
      const charIndex =
        parseInt(hash.substr(i * 2, 2), 16) % allowedChars.length;
      code += allowedChars[charIndex];
      // 在第4位后添加连字符
      if (i === 3) {
        code += "-";
      }
    }

    // 准备存储到数据库的数据
    const invitationData = {
      invitation_code: code,
      type: 2, // 类型为2表示学员邀请码
      is_used: false,
      used_by: "",
      created_by: OPENID, // 记录是哪个教练创建的
    };

    // 保存到数据库
    await app.models.invitation_c.create({
      data: invitationData,
    });
    return {
      success: true,
      message: "成功生成学员邀请码",
      code: code,
    };
  } catch (error) {
    console.error("生成邀请码失败:", error);
    return {
      success: false,
      message: "生成邀请码失败",
      error: error.message,
    };
  }
};
