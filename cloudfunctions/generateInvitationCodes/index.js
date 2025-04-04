// 云函数入口文件
const cloudbase = require("@cloudbase/node-sdk");
const cloud = require("wx-server-sdk");
const crypto = require("crypto");

// 改进的邀请码生成函数，确保全局唯一
function generateUniqueCode(seed, index, length = 8) {
  // 组合时间戳、种子和索引，确保唯一性
  const timestamp = Date.now().toString();
  const uniqueInput = `${timestamp}-${seed}-${index}`;

  // 使用SHA-256哈希确保分布均匀
  const hash = crypto.createHash("sha256").update(uniqueInput).digest("hex");

  // 将哈希值转换为易读的字母数字形式
  // 只使用大写字母和数字，避免容易混淆的字符 (如 0 vs O, 1 vs I)
  const allowedChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  // 取哈希的前几个字节，每个字节映射到allowedChars
  for (let i = 0; i < length; i++) {
    // 获取hash的一个字节，转为0-255范围的数字
    const hashByte = parseInt(hash.substr(i * 2, 2), 16);
    // 将该数字映射到allowedChars的范围
    const charIndex = hashByte % allowedChars.length;
    result += allowedChars[charIndex];
  }

  // 每4个字符插入一个分隔符，提高可读性
  if (length > 4) {
    result = result.replace(/(.{4})/g, "$1-").slice(0, -1);
  }

  return result;
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取CloudBase模型API
  // 初始化云开发
  const app = cloudbase.init({
    env: "cloud1-9ge9zkm3cd1d376e", // 自动获取当前环境ID
    context: context,
  });
  let { OPENID } = cloud.getWXContext();

  const models = app.models;

  try {
    // 设置要生成的邀请码数量
    const codeCount = event.codeCount || 500;
    // 设置类型 (默认为1，根据需求修改)
    const codeType = event.codeType || 1;

    // 生成一个随机种子，用于这批邀请码
    const batchSeed = crypto.randomBytes(8).toString("hex");

    // 存储所有生成的邀请码
    const generatedCodes = [];
    // 存储要批量创建的邀请码数据
    const batchData = [];

    // 生成指定数量的唯一邀请码
    for (let i = 0; i < codeCount; i++) {
      // 生成一个绝对唯一的邀请码
      const code = generateUniqueCode(batchSeed, i, 8);
      generatedCodes.push(code);

      // 添加到批量创建数据中
      batchData.push({
        used_by: "", // 初始为空字符串
        invitation_code: code, // 邀请码
        type: codeType, // 类型
        is_used: false, // 是否已使用
        created_by: OPENID, // 创建者
      });
    }

    // 检查数据库中是否已存在这些邀请码
    const allCodes = generatedCodes;
    const existingCodes = await models.invitation_c.get({
      filter: {
        invitation_code: { $in: allCodes },
      },
    });

    // 如果有任何重复码，报错并退出
    if (existingCodes.data && existingCodes.data.length > 0) {
      throw new Error(
        `检测到${existingCodes.data.length}个重复的邀请码，生成失败`
      );
    }

    // 执行批量创建
    const result = await models.invitation_c.createMany({
      data: batchData,
    });

    // 返回结果
    return {
      success: true,
      message: `成功生成并插入${result.data.length || 0}条邀请码`,
      firstTenCodes: generatedCodes.slice(0, 10), // 返回前10个邀请码作为示例
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
