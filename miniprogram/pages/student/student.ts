import { UserService, IUserInfo } from "../../services/userService";
import {
  TrainingDay,
  Exercise,
  DietPlan,
  Meal,
  MealFood,
  Supplement,
} from "../todayTraining/todayTraining";

// 格式化日期为"年月日"格式
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}年${month}月${day}日`;
}

Page({
  data: {
    statusBarHeight: 0,
    todayDate: "",
    selectedDate: "",
    isToday: true,
    activeTab: "training" as "training" | "diet" | "supplements",

    // 训练相关
    trainingDay: null as TrainingDay | null,
    // 训练组编辑状态
    editingExerciseIndex: -1,
    editingSetIndex: -1,
    editingField: "",
    editingValue: "",

    // 身体状况记录
    bodyStats: {
      weight: "",
      chest: "",
      hip: "",
      arm: "",
      photoUrl: "",
    },
    isEditingBodyStats: false,

    // 饮食相关
    dietPlan: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      meals: [] as Meal[],
    } as DietPlan,
    dietFeedback: "",

    // 补剂相关
    supplements: [] as Supplement[],
    supplementNotes: "",
    supplementFeedback: "",

    // 补剂分时段完成状态
    hasMorningSupplements: false,
    hasNoonSupplements: false,
    hasPreWorkoutSupplements: false,
    hasPostWorkoutSupplements: false,
    hasEveningSupplements: false,
    morningSupplementsCompleted: false,
    noonSupplementsCompleted: false,
    preWorkoutSupplementsCompleted: false,
    postWorkoutSupplementsCompleted: false,
    eveningSupplementsCompleted: false,

    loading: false,
    dataChanged: false,
  },

  onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;
    // 设置状态栏高度和日期
    const today = new Date();
    const formattedDate = formatDateString(today);
    const dateString = this.formatDateForPicker(today);
    console.log("I have loaded the page");
    this.setData({
      statusBarHeight,
      todayDate: formattedDate,
      selectedDate: dateString,
      isToday: true,
    });
    // 加载数据
    this.loadData();
  },

  onShow() {
    // 刷新数据
    if (this.data.dataChanged) {
      this.loadData();
    }
  },

  onUnload() {
    // 如果有未保存的更改，提示用户
    if (this.data.dataChanged) {
      // this.saveAllData();
    }
  },

  // 添加下拉刷新处理函数
  onPullDownRefresh() {
    console.log("下拉刷新");
    this.loadData().then(() => {
      // 停止下拉刷新动画
      wx.stopPullDownRefresh();
    });
  },

  // 导航到个人中心页面
  navigateToProfile() {
    wx.navigateTo({
      url: "/pages/studentDetail/studentDetail",
    });
  },

  // 格式化日期为picker需要的格式 (YYYY-MM-DD)
  formatDateForPicker(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  // 解析picker日期为Date对象
  parseDateFromPicker(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  },

  // 加载所有数据
  async loadData() {
    this.setData({ loading: true });
    try {
      // await Promise.all([
      //   // this.fetchTrainingData(),
      //   // this.fetchDietData(),
      //   // this.fetchSupplementData(),
      // ]);
      // 获取训练日数据
      const date = this.data.selectedDate;
      const trainingDay = this.getMockTrainingDay(date);

      // 获取饮食计划数据
      const dietPlan = this.getMockDietPlan(date);

      // 获取补剂数据
      const supplements = this.getMockSupplements(date);

      // 获取身体状况数据
      const bodyStats = await this.fetchBodyStats(date);

      this.setData({
        trainingDay,
        dietPlan,
        supplements,
        bodyStats,
      });
      this.calculateSupplementsByTimeOfDay();
      console.log(this.data);
      return Promise.resolve(); // 确保返回Promise
    } catch (error) {
      console.error("加载数据失败:", error);
      wx.showToast({
        title: "加载失败，请重试",
        icon: "none",
      });
      return Promise.reject(error); // 返回被拒绝的Promise
    } finally {
      this.setData({ loading: false });
    }
  },

  // 获取训练数据
  async fetchTrainingData() {
    try {
      const result = await wx.cloud.callFunction({
        name: "getStudentTrainingPlan",
        data: {
          date: this.data.selectedDate,
        },
      });

      const response = result.result as any;
      if (response.success && response.data) {
        this.setData({
          trainingDay: response.data,
        });
      } else {
        this.setData({
          trainingDay: null,
        });
      }
    } catch (error) {
      console.error("获取训练数据失败:", error);
      this.setData({
        trainingDay: null,
      });
    }
  },

  // 获取饮食数据
  async fetchDietData() {
    try {
      const result = await wx.cloud.callFunction({
        name: "getStudentDietPlan",
        data: {
          date: this.data.selectedDate,
        },
      });

      const response = result.result as any;
      if (response.success && response.data) {
        this.setData({
          dietPlan: response.data.plan,
          dietFeedback: response.data.feedback || "",
        });
      } else {
        this.setData({
          dietPlan: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            meals: [],
          },
          dietFeedback: "",
        });
      }
    } catch (error) {
      console.error("获取饮食数据失败:", error);
      this.setData({
        dietPlan: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          meals: [],
        },
        dietFeedback: "",
      });
    }
  },

  // 获取补剂数据
  async fetchSupplementData() {
    try {
      const result = await wx.cloud.callFunction({
        name: "getStudentSupplements",
        data: {
          date: this.data.selectedDate,
        },
      });

      const response = result.result as any;
      if (response.success && response.data) {
        this.setData({
          supplements: response.data.supplements,
          supplementNotes: response.data.notes || "",
          supplementFeedback: response.data.feedback || "",
          morningSupplementsCompleted: response.data.morningCompleted || false,
          noonSupplementsCompleted: response.data.noonCompleted || false,
          preWorkoutSupplementsCompleted:
            response.data.preWorkoutCompleted || false,
          postWorkoutSupplementsCompleted:
            response.data.postWorkoutCompleted || false,
          eveningSupplementsCompleted: response.data.eveningCompleted || false,
        });
      } else {
        this.setData({
          supplements: [],
          supplementNotes: "",
          supplementFeedback: "",
          morningSupplementsCompleted: false,
          noonSupplementsCompleted: false,
          preWorkoutSupplementsCompleted: false,
          postWorkoutSupplementsCompleted: false,
          eveningSupplementsCompleted: false,
        });
      }
    } catch (error) {
      console.error("获取补剂数据失败:", error);
      this.setData({
        supplements: [],
        supplementNotes: "",
        supplementFeedback: "",
        morningSupplementsCompleted: false,
        noonSupplementsCompleted: false,
        preWorkoutSupplementsCompleted: false,
        postWorkoutSupplementsCompleted: false,
        eveningSupplementsCompleted: false,
      });
    }
  },

  // 切换标签页
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 切换日期
  onDateChange(e: any) {
    const dateString = e.detail.value;
    const selectedDate = this.parseDateFromPicker(dateString);
    const formattedDate = formatDateString(selectedDate);
    const today = new Date();

    // 检查是否是今天
    const isToday =
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    this.setData(
      {
        selectedDate: dateString,
        todayDate: formattedDate,
        isToday,
      },
      () => {
        this.loadData();
      }
    );
  },

  // 前一天
  previousDay() {
    const currentDate = this.parseDateFromPicker(this.data.selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);

    const dateString = this.formatDateForPicker(currentDate);
    const formattedDate = formatDateString(currentDate);
    const today = new Date();

    // 检查是否是今天
    const isToday =
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();

    this.setData(
      {
        selectedDate: dateString,
        todayDate: formattedDate,
        isToday,
      },
      () => {
        this.loadData();
      }
    );
  },

  // 后一天
  nextDay() {
    const currentDate = this.parseDateFromPicker(this.data.selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);

    const dateString = this.formatDateForPicker(currentDate);
    const formattedDate = formatDateString(currentDate);
    const today = new Date();

    // 检查是否是今天
    const isToday =
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();

    this.setData(
      {
        selectedDate: dateString,
        todayDate: formattedDate,
        isToday,
      },
      () => {
        this.loadData();
      }
    );
  },

  // 切换训练动作完成状态
  toggleExerciseComplete(e: any) {
    const index = e.currentTarget.dataset.exerciseIndex;
    const trainingDay = this.data.trainingDay;

    if (!trainingDay) return;

    const exercise = trainingDay.exercises[index];
    exercise.completed = !exercise.completed;

    this.setData({
      [`trainingDay.exercises[${index}].completed`]: exercise.completed,
      dataChanged: true,
    });
  },

  // 切换饭食完成状态
  toggleMealComplete(e: any) {
    const index = e.currentTarget.dataset.mealIndex;
    const meal = this.data.dietPlan.meals[index];

    meal.completed = !meal.completed;

    this.setData({
      [`dietPlan.meals[${index}].completed`]: meal.completed,
      dataChanged: true,
    });
  },

  // 切换早上补剂完成状态
  toggleMorningSupplements() {
    this.setData({
      morningSupplementsCompleted: !this.data.morningSupplementsCompleted,
      dataChanged: true,
    });
  },

  // 切换中午补剂完成状态
  toggleNoonSupplements() {
    this.setData({
      noonSupplementsCompleted: !this.data.noonSupplementsCompleted,
      dataChanged: true,
    });
  },

  // 切换训练前补剂完成状态
  togglePreWorkoutSupplements() {
    this.setData({
      preWorkoutSupplementsCompleted: !this.data.preWorkoutSupplementsCompleted,
      dataChanged: true,
    });
  },

  // 切换训练后补剂完成状态
  togglePostWorkoutSupplements() {
    this.setData({
      postWorkoutSupplementsCompleted:
        !this.data.postWorkoutSupplementsCompleted,
      dataChanged: true,
    });
  },

  // 切换晚上补剂完成状态
  toggleEveningSupplements() {
    this.setData({
      eveningSupplementsCompleted: !this.data.eveningSupplementsCompleted,
      dataChanged: true,
    });
  },

  // 上传训练视频
  uploadVideo(e: any) {
    const index = e.currentTarget.dataset.exerciseIndex;

    wx.chooseMedia({
      count: 1,
      mediaType: ["video"],
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;

        wx.showLoading({ title: "上传中..." });

        // 上传到云存储
        const cloudPath = `training-videos/${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}.mp4`;

        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: tempFilePath,
          success: (res) => {
            const fileID = res.fileID;

            this.setData({
              [`trainingDay.exercises[${index}].videoUrl`]: fileID,
              dataChanged: true,
            });

            wx.hideLoading();
            wx.showToast({
              title: "上传成功",
              icon: "success",
            });
          },
          fail: (err) => {
            console.error("上传视频失败:", err);
            wx.hideLoading();
            wx.showToast({
              title: "上传失败",
              icon: "error",
            });
          },
        });
      },
    });
  },

  // 提供训练反馈
  provideFeedback(e: any) {
    const index = e.currentTarget.dataset.exerciseIndex;
    const exercise = this.data.trainingDay?.exercises[index];

    if (!exercise) return;

    wx.showModal({
      title: "训练反馈",
      content: "请输入对本次训练的反馈",
      editable: true,
      placeholderText: "例如：完成了5组，感觉良好",
      value: exercise.feedback || "",
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({
            [`trainingDay.exercises[${index}].feedback`]: res.content,
            dataChanged: true,
          });
        }
      },
    });
  },

  // 提问教练
  askQuestion(e: any) {
    const index = e.currentTarget.dataset.exerciseIndex;
    const exercise = this.data.trainingDay?.exercises[index];

    if (!exercise) return;

    wx.showModal({
      title: "提问教练",
      content: "请输入您的问题",
      editable: true,
      placeholderText: "例如：这个动作应该感觉哪里发力？",
      value: exercise.question || "",
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({
            [`trainingDay.exercises[${index}].question`]: res.content,
            dataChanged: true,
          });
        }
      },
    });
  },

  // 提供饮食反馈
  provideDietFeedback() {
    wx.showModal({
      title: "饮食反馈",
      content: "请输入对今日饮食的反馈",
      editable: true,
      placeholderText: "例如：早餐有些吃不下，午餐增加了一些蛋白质",
      value: this.data.dietFeedback || "",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            dietFeedback: res.content,
            dataChanged: true,
          });
        }
      },
    });
  },

  // 提供补剂反馈
  provideSupplementFeedback() {
    wx.showModal({
      title: "补剂反馈",
      content: "请输入对今日补剂使用的反馈",
      editable: true,
      placeholderText: "例如：肌酸有些胃部不适，蛋白粉感觉效果不错",
      value: this.data.supplementFeedback || "",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            supplementFeedback: res.content,
            dataChanged: true,
          });
        }
      },
    });
  },

  uploadMealImage(e: any) {
    const mealIndex = e.currentTarget.dataset.mealIndex;
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        // 上传图片到云存储
        wx.cloud.uploadFile({
          cloudPath: `meal-images/${Date.now()}-${Math.random()
            .toString(36)
            .substr(2)}.${tempFilePath.split(".").pop()}`,
          filePath: tempFilePath,
          success: (res) => {
            // 更新对应餐次的 imageUrl
            const meals = this.data.dietPlan.meals;
            meals[mealIndex].imageUrl = res.fileID;
            this.setData({
              "dietPlan.meals": meals,
            });
          },
          fail: console.error,
        });
      },
    });
  },

  // 预览饮食图片
  previewImage(e: any) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的链接
      urls: [url], // 需要预览的图片链接列表
    });
  },

  // 开始编辑训练组
  startEditSet(e: any) {
    const exerciseIndex = e.currentTarget.dataset.exerciseIndex;
    const setIndex = e.currentTarget.dataset.setIndex;
    const field = e.currentTarget.dataset.field;
    const value =
      this.data.trainingDay?.exercises[exerciseIndex].sets[setIndex][field] ||
      "";

    this.setData({
      editingExerciseIndex: exerciseIndex,
      editingSetIndex: setIndex,
      editingField: field,
      editingValue: value,
    });
  },

  // 处理训练组编辑输入
  onSetEditInput(e: any) {
    const field = e.currentTarget.dataset.field;
    let value = e.detail.value;

    // 处理不同字段的数据类型验证
    if (field === "reps") {
      // 移除所有非数字字符
      value = value.replace(/[^0-9]/g, "");
      // 转换为整数
      if (value) {
        value = parseInt(value, 10);
      }
    } else if (field === "weight") {
      // 对于重量，允许数字和单位字母，但清理其他字符
      value = value.replace(/[^0-9a-zA-Z.]/g, "");
    }

    this.setData({
      editingValue: value,
    });
  },

  // 保存训练组编辑
  saveSetEdit(e: any) {
    const exerciseIndex = e.currentTarget.dataset.exerciseIndex;
    const setIndex = e.currentTarget.dataset.setIndex;
    const field = e.currentTarget.dataset.field;
    let value = this.data.editingValue as any;

    // 处理不同字段的格式化
    if (field === "reps") {
      // 确保是整数
      const repsValue = parseInt(value, 10);
      if (!isNaN(repsValue)) {
        // 保存为字符串格式的整数
        value = repsValue;
      } else {
        // 无效输入，使用默认值
        value = "0次";
      }
    } else if (field === "weight") {
      // 处理重量字段格式化
      if (value && !value.match(/[a-zA-Z]/)) {
        // 如果只有数字，添加"kg"单位
        value = value + "kg";
      }
    }

    if (this.data.trainingDay && this.data.trainingDay.exercises) {
      // 更新对应的训练组数据
      this.setData({
        [`trainingDay.exercises[${exerciseIndex}].sets[${setIndex}].${field}`]:
          value,
        editingExerciseIndex: -1,
        editingSetIndex: -1,
        editingField: "",
        editingValue: "",
        dataChanged: true,
      });
    }
  },

  // 刷新数据
  refreshData() {
    // 如果有未保存的更改，询问用户是否要保存
    if (this.data.dataChanged) {
      wx.showModal({
        title: "未保存的更改",
        content: "您有未保存的更改，是否先保存这些更改？",
        confirmText: "保存",
        cancelText: "不保存",
        success: (res) => {
          if (res.confirm) {
            // this.saveAllData().then(() => {
            //   this.loadData();
            // });
          } else {
            this.setData({ dataChanged: false }, () => {
              this.loadData();
            });
          }
        },
      });
    } else {
      this.loadData();
    }
  },

  // 修改 getMockTrainingDay 方法，添加视频和问题数据
  getMockTrainingDay(date: string): TrainingDay | null {
    // 根据日期返回不同的训练日数据
    const dayOfWeek = this.parseDate(date).getDay(); // 0 是周日，1-6 是周一到周六

    // 修改周一的训练数据，添加视频和问题
    if (dayOfWeek === 1) {
      // 周一
      return {
        day: "周一",
        focus: "胸部/肩部",
        exercises: [
          {
            name: "平板杠铃卧推",
            sets: [
              { weight: "60kg", reps: 12 },
              { weight: "70kg", reps: 8 },
              { weight: "80kg", reps: 8 },
              { weight: "85kg", reps: 9 },
            ],
            note: "注意肩膀下沉，胸部挺起",
            feedback: "最后两组没有完成，感觉力量不足",
            completed: false,
            videoUrl: "https://example.com/videos/bench_press.mp4", // 示例视频URL
            question:
              "教练，我在做最后两组时感觉右肩有点疼，这是正常的吗？我应该如何调整姿势？", // 示例问题
          },
          {
            name: "上斜哑铃卧推",
            sets: [
              { weight: "60kg", reps: 12 },
              { weight: "70kg", reps: 8 },
              { weight: "80kg", reps: 8 },
              { weight: "85kg", reps: 9 },
            ],
            completed: true,
            videoUrl: "https://example.com/videos/incline_press.mp4",
          },
          {
            name: "坐姿哑铃肩推",
            sets: [
              { weight: "60kg", reps: 12 },
              { weight: "70kg", reps: 8 },
              { weight: "80kg", reps: 8 },
              { weight: "85kg", reps: 9 },
            ],
            feedback: "最后一组感觉肩部疲劳",
            completed: false,
            question:
              "教练，我做肩推时感觉不到肩部发力，更多是手臂在用力，有什么技巧吗？",
          },
        ],
      };
    } else if (dayOfWeek === 3) {
      // 周三
      return {
        day: "周三",
        focus: "背部/二头肌",
        exercises: [
          {
            name: "引体向上",
            sets: [
              { weight: "60kg", reps: 12 },
              { weight: "70kg", reps: 8 },
              { weight: "80kg", reps: 8 },
              { weight: "85kg", reps: 9 },
            ],
            completed: true,
          },
          {
            name: "坐姿划船",
            sets: [
              { weight: "60kg", reps: 12 },
              { weight: "70kg", reps: 8 },
              { weight: "80kg", reps: 8 },
              { weight: "85kg", reps: 9 },
            ],
            completed: true,
          },
        ],
      };
    } else if (dayOfWeek === 5) {
      // 周五
      return {
        day: "周五",
        focus: "腿部/三头肌",
        exercises: [
          {
            name: "杠铃深蹲",
            sets: [
              { weight: "60kg", reps: 12 },
              { weight: "70kg", reps: 8 },
              { weight: "80kg", reps: 8 },
              { weight: "85kg", reps: 9 },
            ],
            note: "注意膝盖不要超过脚尖",
            completed: false,
          },
          {
            name: "腿举",
            sets: [
              { weight: "60kg", reps: 12 },
              { weight: "70kg", reps: 8 },
              { weight: "80kg", reps: 8 },
              { weight: "85kg", reps: 9 },
            ],
            completed: false,
          },
        ],
      };
    } else {
      // 其他日期没有训练安排
      return null;
    }
  },

  // 模拟获取饮食计划数据
  getMockDietPlan(date: string): DietPlan {
    // 根据日期返回不同的饮食计划数据
    const dayOfWeek = this.parseDate(date).getDay();

    // 基础饮食计划
    const baseDietPlan: DietPlan = {
      calories: 2200,
      protein: 180,
      carbs: 220,
      fat: 60,
      meals: [
        {
          name: "早餐",
          time: "07:30",
          foods: [
            { name: "全麦面包", amount: "2片", completed: true },
            { name: "鸡蛋", amount: "3个", completed: true },
            { name: "牛奶", amount: "250ml", completed: true },
          ],
          completed: true,
        },
        {
          name: "午餐",
          time: "12:00",
          foods: [
            { name: "糙米", amount: "100g", completed: true },
            { name: "鸡胸肉", amount: "150g", completed: true },
            { name: "西兰花", amount: "100g", completed: false },
            { name: "橄榄油", amount: "1茶匙", completed: true },
          ],
          completed: false,
        },
        {
          name: "晚餐",
          time: "18:30",
          foods: [
            { name: "红薯", amount: "150g", completed: false },
            { name: "三文鱼", amount: "150g", completed: false },
            { name: "混合蔬菜", amount: "200g", completed: false },
          ],
          completed: false,
        },
      ],
      notes: "每天饮水至少2升，避免加工食品和精制糖。",
    };

    // 根据日期调整完成情况
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // 周末所有餐都完成
      baseDietPlan.meals.forEach((meal) => {
        meal.completed = true;
        meal.foods.forEach((food) => {
          food.completed = true;
        });
      });
    } else if (dayOfWeek === 5) {
      // 周五只完成早餐
      baseDietPlan.meals[0].completed = true;
      baseDietPlan.meals[0].foods.forEach((food) => {
        food.completed = true;
      });

      baseDietPlan.meals[1].completed = false;
      baseDietPlan.meals[1].foods.forEach((food) => {
        food.completed = false;
      });

      baseDietPlan.meals[2].completed = false;
      baseDietPlan.meals[2].foods.forEach((food) => {
        food.completed = false;
      });
    }

    return baseDietPlan;
  },

  // 模拟获取补剂数据
  getMockSupplements(date: string): Supplement[] {
    // 根据日期返回不同的补剂数据
    const dayOfWeek = this.parseDate(date).getDay();

    // 基础补剂数据
    const baseSupplements: Supplement[] = [
      {
        name: "乳清蛋白",
        dosage: "30g",
        morning: "",
        noon: "",
        evening: "1勺",
        morningCompleted: false,
        noonCompleted: false,
        eveningCompleted: true,
        completed: true,
      },
      {
        name: "肌酸",
        dosage: "5g",
        morning: "5g",
        noon: "",
        evening: "",
        morningCompleted: true,
        noonCompleted: false,
        eveningCompleted: false,
        completed: true,
      },
      {
        name: "鱼油",
        dosage: "1000mg",
        morning: "1粒",
        noon: "",
        evening: "1粒",
        morningCompleted: true,
        noonCompleted: false,
        eveningCompleted: false,
        completed: false,
      },
      {
        name: "维生素D",
        dosage: "2000IU",
        morning: "1粒",
        noon: "",
        evening: "",
        morningCompleted: false,
        noonCompleted: false,
        eveningCompleted: false,
        completed: false,
      },
    ];

    // 根据日期调整完成情况
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // 周末所有补剂都完成
      baseSupplements.forEach((supplement) => {
        supplement.morningCompleted = supplement.morning ? true : false;
        supplement.noonCompleted = supplement.noon ? true : false;
        supplement.eveningCompleted = supplement.evening ? true : false;
        supplement.completed = true;
      });
    } else if (dayOfWeek === 5) {
      // 周五只完成部分补剂
      baseSupplements[0].morningCompleted = false;
      baseSupplements[0].noonCompleted = false;
      baseSupplements[0].eveningCompleted = false;
      baseSupplements[0].completed = false;

      baseSupplements[1].morningCompleted = true;
      baseSupplements[1].completed = true;

      baseSupplements[2].morningCompleted = false;
      baseSupplements[2].eveningCompleted = false;
      baseSupplements[2].completed = false;

      baseSupplements[3].morningCompleted = false;
      baseSupplements[3].completed = false;
    }

    return baseSupplements;
  },

  // 解析日期字符串为 Date 对象
  parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  },

  // 计算各时段补剂完成情况
  calculateSupplementsByTimeOfDay() {
    const supplements = this.data.supplements || [];

    // 检查是否有早上、中午、晚上的补剂
    const hasMorningSupplements = supplements.some((s) => s.morning);
    const hasNoonSupplements = supplements.some((s) => s.noon);
    const hasEveningSupplements = supplements.some((s) => s.evening);

    // 计算各时段补剂完成情况
    const morningSupplements = supplements.filter((s) => s.morning);
    const noonSupplements = supplements.filter((s) => s.noon);
    const eveningSupplements = supplements.filter((s) => s.evening);

    const morningSupplementsCompleted =
      morningSupplements.length > 0 &&
      morningSupplements.every((s) => s.morningCompleted);

    const noonSupplementsCompleted =
      noonSupplements.length > 0 &&
      noonSupplements.every((s) => s.noonCompleted);

    const eveningSupplementsCompleted =
      eveningSupplements.length > 0 &&
      eveningSupplements.every((s) => s.eveningCompleted);

    this.setData({
      hasMorningSupplements,
      hasNoonSupplements,
      hasEveningSupplements,
      morningSupplementsCompleted,
      noonSupplementsCompleted,
      eveningSupplementsCompleted,
    });
  },

  // 切换身体状况编辑模式
  toggleBodyStatsEdit() {
    const isEditing = !this.data.isEditingBodyStats;
    this.setData({ isEditingBodyStats: isEditing });

    // 如果从编辑模式切换回查看模式，保存身体状况数据
    if (!isEditing) {
      this.saveBodyStats();
    }
  },

  // 处理身体状况数据输入
  onBodyStatInput(e: any) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;

    this.setData({
      [`bodyStats.${field}`]: value,
    });
  },

  // 保存身体状况数据
  saveBodyStats() {
    // 在这里可以添加数据验证
    this.setData({
      dataChanged: true,
    });

    // 这里可以添加实际的保存逻辑，例如将数据发送到服务器
    console.log("保存身体状况数据:", this.data.bodyStats);
  },

  // 上传身体照片
  uploadBodyPhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;

        wx.showLoading({ title: "上传中..." });

        // 上传到云存储
        const cloudPath = `body-photos/${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}.${tempFilePath.split(".").pop()}`;

        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: tempFilePath,
          success: (res) => {
            const fileID = res.fileID;

            this.setData({
              "bodyStats.photoUrl": fileID,
              dataChanged: true,
            });

            wx.hideLoading();
            wx.showToast({
              title: "上传成功",
              icon: "success",
            });
          },
          fail: (err) => {
            console.error("上传照片失败:", err);
            wx.hideLoading();
            wx.showToast({
              title: "上传失败",
              icon: "error",
            });
          },
        });
      },
    });
  },

  // 获取身体状况数据
  async fetchBodyStats(date: string) {
    // 实际应用中应该从服务器获取数据
    // 这里返回模拟数据或空数据
    try {
      // 模拟从服务器获取数据
      // const result = await wx.cloud.callFunction({
      //   name: "getBodyStats",
      //   data: { date }
      // });

      // 返回模拟数据
      // 周一返回一些数据，其他日期返回空数据
      const dayOfWeek = this.parseDate(date).getDay();

      if (dayOfWeek === 1) {
        // 周一
        return {
          weight: "78.5",
          chest: "98",
          hip: "95",
          arm: "36",
          photoUrl: "", // 实际应用中这里会是一个真实的URL
        };
      } else {
        return {
          weight: "",
          chest: "",
          hip: "",
          arm: "",
          photoUrl: "",
        };
      }
    } catch (error) {
      console.error("获取身体状况数据失败:", error);
      return {
        weight: "",
        chest: "",
        hip: "",
        arm: "",
        photoUrl: "",
      };
    }
  },

  // 保存全部数据
  async saveAllData() {
    wx.showLoading({ title: "保存中..." });

    try {
      // 保存训练数据
      // await this.saveTrainingData();

      // 保存饮食数据
      // await this.saveDietData();

      // 保存补剂数据
      // await this.saveSupplementData();

      // 保存身体状况数据
      await this.saveBodyStatsToServer();

      this.setData({ dataChanged: false });

      wx.hideLoading();
      wx.showToast({
        title: "保存成功",
        icon: "success",
      });
    } catch (error) {
      console.error("保存数据失败:", error);
      wx.hideLoading();
      wx.showToast({
        title: "保存失败",
        icon: "error",
      });
    }
  },

  // 保存身体状况到服务器
  async saveBodyStatsToServer() {
    try {
      // 实际的云函数调用，将数据保存到服务器
      // await wx.cloud.callFunction({
      //   name: "saveBodyStats",
      //   data: {
      //     date: this.data.selectedDate,
      //     stats: this.data.bodyStats
      //   }
      // });

      // 模拟保存成功
      console.log("成功保存身体状况数据:", this.data.bodyStats);
      return Promise.resolve();
    } catch (error) {
      console.error("保存身体状况数据失败:", error);
      return Promise.reject(error);
    }
  },
});
