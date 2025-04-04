// 云函数入口文件
const cloudbase = require("@cloudbase/node-sdk");

// 云函数入口函数
exports.main = async (event, context) => {
  const app = cloudbase.init({
    env: "cloud1-9ge9zkm3cd1d376e", // 使用您的云环境ID
    context: context,
  });
  const { student_id, coach_id, date } = event;

  // 参数验证
  if (!student_id || !date || !coach_id) {
    return {
      success: false,
      code: 400,
      message: "缺少必要参数: student_id 或 date",
    };
  }

  try {
    console.log(student_id, coach_id, date);
    // 使用 models API 查询该教练的所有学生，添加分页功能
    const data = await app.models.daily_t.get({
      filter: {
        where: {
          $and: [
            {
              coach_id: {
                $eq: coach_id,
              },
            },
            {
              student_id: {
                $eq: student_id,
              },
            },
            {
              date_string: {
                $eq: date, // 使用时间戳进行比较
              },
            },
          ],
        },
      },
    });
    console.log(data);

    // 检查是否找到数据
    if (data.length === 0) {
      return {
        success: false,
        code: 404,
        message: "未找到该日期的训练数据",
        date: date,
        student_id: student_id,
      };
    }

    return {
      success: true,
      code: 200,
      data: {
        student_id: data.student_id,
        coach_id: data.coach_id,
        date: data.training_date,
        exercise_data: data.exercise_data || {},
        supplement_data: data.supplement_data || {},
        meal_data: data.meal_data || {},
        body_stats: data.body_stats || {},
      },
    };
  } catch (err) {
    console.error("获取训练数据失败:", err);
    return {
      success: false,
      code: 500,
      message: "获取训练数据失败",
      error: err,
    };
  }
};
