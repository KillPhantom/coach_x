// 云函数入口文件
const cloudbase = require("@cloudbase/node-sdk");
const cloud = require("wx-server-sdk");

// 云函数入口函数
exports.main = async (event, context) => {
  const app = cloudbase.init({
    env: "cloud1-9ge9zkm3cd1d376e", // 使用您的云环境ID
    context: context,
  });
  let { OPENID } = cloud.getWXContext();
  const open_id = OPENID;

  console.log("OPENID is ", OPENID);
  const models = app.models;
  // 获取邀请码和用户ID
  const { code } = event;

  try {
    // 查询邀请码是否存在且未被使用 - 使用正确的语法
    const codeRecord = await models.invitation_c.get({
      filter: {
        where: {
          $and: [
            {
              invitation_code: {
                $eq: code,
              },
            },
            {
              is_used: {
                $eq: false,
              },
            },
          ],
        },
      },
    });

    console.log("Found invitation code:", codeRecord);

    // 检查邀请码是否存在且未使用
    const codeExists =
      codeRecord.data &&
      Object.keys(codeRecord.data).length > 0 &&
      codeRecord.data.invitation_code;

    if (!codeExists) {
      return {
        valid: false,
        message: "邀请码已被使用",
      };
    }

    // 邀请码有效，确定用户角色
    const codeType = codeRecord.data.type;
    let userRole = "unknown"; // 默认为学生

    if (codeType === 1) {
      userRole = "coach";
    } else if (codeType === 2) {
      userRole = "student";
    }

    // 更新用户信息 - 使用正确的语法
    const userUpdateResult = await models.users.update({
      data: {
        is_verified: true,
        role: userRole,
      },
      filter: {
        where: {
          $and: [
            {
              open_id: {
                $eq: open_id,
              },
            },
          ],
        },
      },
      envType: "prod", // 或 "pre" 取决于您的环境
    });

    console.log("Updated user:", userUpdateResult);

    // 标记邀请码为已使用 - 使用正确的语法
    const codeUpdateResult = await models.invitation_c.update({
      data: {
        is_used: true,
        used_by: open_id,
      },
      filter: {
        where: {
          $and: [
            {
              invitation_code: {
                $eq: code,
              },
            },
          ],
        },
      },
      envType: "prod", // 或 "pre" 取决于您的环境
    });

    console.log("Updated invitation code:", codeUpdateResult);

    return {
      valid: true,
      message: "邀请码验证成功",
      role: userRole,
    };
  } catch (error) {
    console.error("验证邀请码出错:", error);
    return {
      valid: false,
      message: "验证过程中发生错误",
      error: error.message,
    };
  }
};
