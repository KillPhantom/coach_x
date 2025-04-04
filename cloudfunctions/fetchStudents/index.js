// 云函数入口文件
const cloudbase = require("@cloudbase/node-sdk");
const cloud = require("wx-server-sdk");

// 云函数入口函数
exports.main = async (event, context) => {
  const app = cloudbase.init({
    env: "cloud1-9ge9zkm3cd1d376e", // 使用您的云环境ID
    context: context,
  });
  const { OPENID } = cloud.getWXContext();

  // 获取分页参数，默认第1页，每页10条
  const pageSize = event.pageSize || 10;
  const pageNumber = event.pageNumber || 1;
  const otherParams = event.otherParams || {};

  try {
    // 使用 models API 查询该教练的所有学生，添加分页功能
    const usersResult = await app.models.users.list({
      filter: {
        where: {
          $and: [
            {
              coach_id: {
                $eq: OPENID,
              },
            },
            {
              role: {
                $eq: "student",
              },
            },
            otherParams,
          ],
        },
      },
      pageSize: pageSize, // 分页大小
      pageNumber: pageNumber, // 第几页
      getCount: true, // 获取总数
    });

    // 如果查询成功但没有记录
    if (!usersResult.data || usersResult.data.length === 0) {
      return {
        success: true,
        students: [],
        pagination: {
          total: 0,
          pageSize: pageSize,
          pageNumber: pageNumber,
          totalPages: 0,
        },
        message: "未找到学生记录",
      };
    }

    // 计算总页数
    const totalPages = Math.ceil(usersResult.data.total / pageSize);
    console.log("totalPages", totalPages, usersResult);

    // 查询成功并有记录
    return {
      success: true,
      students: usersResult.data,
      pagination: {
        total: usersResult.data.total,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    // 查询失败
    console.error("获取学生列表失败:", error);
    return {
      success: false,
      message: "获取学生列表失败",
      error: error.message,
    };
  }
};
