// index.js
const cloudbase = require("@cloudbase/node-sdk");
const cloud = require("wx-server-sdk");

// 云函数入口函数
exports.main = async (event, context) => {
  // 这里获取到的 openId、appId 和 unionId 是可信的，注意 unionId 仅在满足 unionId 获取条件时返回

  const app = cloudbase.init({
    env: "cloud1-9ge9zkm3cd1d376e", // 自动获取当前环境ID
    context: context,
  });

  const models = app.models;
  let { OPENID } = cloud.getWXContext();

  // 获取openid
  const { userInfo } = event;

  // 将性别从数字转为字符串
  let genderString = "unknown";
  if (userInfo.gender === 1) {
    genderString = "male";
  } else if (userInfo.gender === 2) {
    genderString = "female";
  }

  try {
    // 使用models API检查用户是否已存在
    let userRecord = await models.users.get({
      filter: {
        where: {
          $and: [
            {
              open_id: {
                $eq: OPENID, // 推荐传入_id数据标识进行操作
              },
            },
          ],
        },
      },
    });

    console.log("userRecord is ", userRecord.data);

    // 检查用户是否存在 - 修改判断逻辑
    const userExists =
      userRecord.data &&
      Object.keys(userRecord.data).length > 0 &&
      userRecord.data.open_id;

    if (!userExists) {
      // 新用户，使用models API插入数据库
      userRecord = await models.users.create({
        data: {
          open_id: OPENID,
          role: "unknown", // 默认为未知角色
          gender: genderString,
          name: userInfo.nickName,
          avatar_url: userInfo.avatarUrl,
          is_admin: false, // 默认非管理员
          is_verified: false, // 默认未验证
        },
      });

      console.log("创建新用户成功:", OPENID);
    } else {
      console.log("用户已存在:", OPENID);
    }

    console.log("userRecord.data is ", userRecord.data);
    // 返回登录结果
    return userRecord.data;
  } catch (error) {
    console.error("登录处理出错:", error);
    return {
      error: error.message,
    };
  }
};
