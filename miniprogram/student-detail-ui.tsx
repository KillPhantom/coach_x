import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StudentDetailPage = () => {
  // 示例数据
  const studentData = {
    name: "张伟",
    age: 28,
    height: 178,
    joinDate: "2024-12-15",
    goal: "减脂增肌",
    avatar: "/api/placeholder/120/120",
    contact: "186****7890",
    nextSession: "2025-03-22 19:00",
    expirationDate: "2025-06-15",
  };

  const weightData = [
    { month: "10月", weight: 78 },
    { month: "11月", weight: 76 },
    { month: "12月", weight: 75 },
    { month: "1月", weight: 73 },
    { month: "2月", weight: 72 },
    { month: "3月", weight: 71 },
  ];

  const measurementsData = {
    current: {
      chest: 96,
      waist: 83,
      hip: 98,
      arm: 35,
      thigh: 54,
    },
    previous: {
      chest: 98,
      waist: 88,
      hip: 100,
      arm: 34,
      thigh: 56,
    },
  };

  // 计算变化百分比
  const calculateChange = (current, previous) => {
    const change = (((current - previous) / previous) * 100).toFixed(1);
    return change > 0 ? `+${change}%` : `${change}%`;
  };

  // 确定变化的颜色 (胸围/手臂增加为正面, 腰围/臀围/大腿减少为正面)
  const getChangeColor = (metric, change) => {
    if (metric === "chest" || metric === "arm") {
      return parseFloat(change) > 0 ? "text-green-500" : "text-red-500";
    } else {
      return parseFloat(change) < 0 ? "text-green-500" : "text-red-500";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 - 移动端样式 */}
      <div className="bg-white py-3 px-4 shadow-sm flex justify-between items-center fixed top-0 left-0 right-0 z-10">
        <button className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-medium">学员详情</h1>
        <button className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      {/* 内容区域 - 添加上边距以避开固定导航栏 */}
      <div className="flex-1 pt-14 pb-4">
        {/* 学员基本信息卡片 */}
        <div className="bg-white mx-3 mt-3 rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 flex items-center">
            <img
              src={studentData.avatar}
              alt="学员头像"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{studentData.name}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {studentData.goal}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {studentData.age}岁 | {studentData.height}cm | 加入:{" "}
                {studentData.joinDate} | 到期: {studentData.expirationDate}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 px-3 py-2 flex justify-between">
            <button className="bg-blue-500 text-white rounded-full py-1 px-3 text-xs flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              发消息
            </button>
            <button className="bg-gray-100 text-gray-600 rounded-full py-1 px-3 text-xs flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              电话
            </button>
            <div className="flex flex-col justify-center">
              <p className="text-gray-400 text-xs">下次课程</p>
              <p className="text-xs font-medium">
                {studentData.nextSession.split(" ")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* 数据内容 - 无标签页导航，直接显示 */}
        <div className="mx-3 my-3">
          <div className="bg-white rounded-xl shadow-sm p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">体重变化</h3>
              <span className="text-green-500 text-xs">-7kg (近6个月)</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart
                data={weightData}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#2563eb" }}
                  activeDot={{ r: 5, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 mb-3">
            <h3 className="text-sm font-medium mb-3">关键数据</h3>
            <div className="flex justify-between gap-2">
              <div className="bg-gray-50 rounded-lg p-2 flex-1">
                <p className="text-gray-500 text-xs">当前体重</p>
                <p className="text-lg font-semibold mt-1">71kg</p>
                <p className="text-green-500 text-xs mt-1">-1kg 较上月</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 flex-1">
                <p className="text-gray-500 text-xs">体脂率</p>
                <p className="text-lg font-semibold mt-1">18.5%</p>
                <p className="text-green-500 text-xs mt-1">-0.8% 较上月</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 flex-1">
                <p className="text-gray-500 text-xs">基础代谢</p>
                <p className="text-lg font-semibold mt-1">1720</p>
                <p className="text-green-500 text-xs mt-1">+25 较上月</p>
              </div>
            </div>
          </div>

          {/* 身体围度数据 - 完全重写 */}
          <div className="bg-white rounded-xl shadow-sm p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">身体围度</h3>
              <span className="text-gray-500 text-xs">单位: cm</span>
            </div>

            <div>
              {Object.entries(measurementsData.current).map(([key, value]) => {
                const labels = {
                  chest: "胸围",
                  waist: "腰围",
                  hip: "臀围",
                  arm: "上臂围",
                  thigh: "大腿围",
                };

                const previousValue = measurementsData.previous[key];
                const changePercent = calculateChange(value, previousValue);
                const changeColorClass = getChangeColor(key, changePercent);

                return (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <p className="text-sm font-medium">{labels[key]}</p>
                    <div className="flex items-center">
                      <span className="text-gray-800 font-medium">{value}</span>
                      <span className={`ml-2 text-xs ${changeColorClass}`}>
                        {changePercent}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
