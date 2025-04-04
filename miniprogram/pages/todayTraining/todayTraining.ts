// 学生训练详情页面
import { UserService, IUserInfo } from "../../services/userService";
import { DateUtils } from "../../utils/dateUtils";
export interface Student {
  id: string;
  name: string;
  avatar: string;
  avatarStyle: string;
  phase: string;
  phaseTagClass: string;
  week: number;
  planName: string;
}

export interface ExerciseReps {
  weight: string;
  reps: number;
}

export interface Exercise {
  name: string;
  sets: ExerciseReps[];
  note?: string;
  feedback?: string;
  completed: boolean;
  videoUrl?: string;
  question?: string;
  answer?: string;
}

export interface TrainingDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface MealFood {
  name: string;
  amount: string;
}

export interface Meal {
  name: string;
  time: string;
  foods: MealFood[];
  completed: boolean;
  imageUrl?: string;
}

export interface DietPlan {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: Meal[];
  notes?: string;
}

export interface Supplement {
  name: string;
  dosage: string;
  morning: string;
  noon: string;
  evening: string;
  morningCompleted: boolean;
  noonCompleted: boolean;
  eveningCompleted: boolean;
  completed: boolean;
}

interface CompletionStatus {
  status: string; // 'completed', 'partial', 'incomplete'
  text: string;
}

Page({
  data: {
    statusBarHeight: 0,
    student: {} as Student,
    selectedDate: "",
    isToday: true,
    activeTab: "training",
    trainingDay: null as TrainingDay | null,
    dietPlan: {} as DietPlan,
    supplements: [] as Supplement[],
    supplementNotes: "",
    trainingCompletion: {
      status: "incomplete",
      text: "未完成",
    } as CompletionStatus,
    dietCompletion: {
      status: "incomplete",
      text: "未完成",
    } as CompletionStatus,
    supplementCompletion: {
      status: "incomplete",
      text: "未完成",
    } as CompletionStatus,
    hasMorningSupplements: false,
    hasNoonSupplements: false,
    hasEveningSupplements: false,
    morningSupplementsCompleted: false,
    noonSupplementsCompleted: false,
    eveningSupplementsCompleted: false,
    reviewStatus: {
      isReviewed: false,
      reviewTime: "",
      reviewComments: "",
    },
    currentUser: {} as IUserInfo,
  },

  onLoad(options) {
    // Get user info and set to data
    const currentUser = UserService.getCurrentUser()!;
    this.setData({
      currentUser: currentUser,
    });

    // 设置标题栏高度
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
    });
    // 获取学员ID
    const studentId = options.id || "";

    // 设置当前日期
    const today = new Date();
    const formattedDate = DateUtils.formatDate(today);

    this.setData({
      selectedDate: formattedDate,
      isToday: true,
      student: { id: studentId } as Student,
    });

    // 加载数据
    this.fetchStudentData();
    this.fetchTrainingData();

    // 模拟获取审核状态
    const mockReviewStatus = {
      isReviewed: false,
      reviewTime: "",
      reviewComments: "",
    };

    this.setData({
      reviewStatus: mockReviewStatus,
    });
  },

  // 解析日期字符串为 Date 对象
  parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  },

  // 获取学员数据
  async fetchStudentData() {
    try {
      setTimeout(() => {
        const student = {
          id: this.data.student.id,
          name: "张三",
          avatar: "张",
          avatarStyle: "",
          phase: "增肌期",
          phaseTagClass: "tag-bulking",
          week: 8,
          planName: "初级增肌计划",
        };

        this.setData({
          student,
        });
      }, 300);
    } catch (error) {
      console.error("获取学员数据失败", error);
      wx.showToast({
        title: "获取学员数据失败",
        icon: "none",
      });
    }
  },

  // 获取训练数据
  async fetchTrainingData() {
    try {
      wx.showLoading({
        title: "加载中...",
      });
      wx.cloud
        .callFunction({
          name: "fetchTodayTraining",
          data: {
            student_id: this.data.student.id,
            coach_id: this.data.currentUser.openId, // 可选
            date: this.data.selectedDate, // 格式: YYYY-MM-DD
          },
        })
        .then((res) => {
          console.log("训练数据:", res.result);
        })
        .catch((err) => {
          console.error("获取训练数据失败", err);
          wx.hideLoading();
          wx.showToast({
            title: "获取训练数据失败",
            icon: "none",
          });
        });

      // setTimeout(() => {
      //   // 获取训练日数据
      //   const trainingDay = this.getMockTrainingDay(date);

      //   // 获取饮食计划数据
      //   const dietPlan = this.getMockDietPlan(date);

      //   // 获取补剂数据
      //   const supplements = this.getMockSupplements(date);

      //   // 计算完成情况
      //   const trainingCompletion =
      //     this.calculateTrainingCompletion(trainingDay);
      //   const dietCompletion = this.calculateDietCompletion(dietPlan);
      //   const supplementCompletion =
      //     this.calculateSupplementCompletion(supplements);

      //   this.setData({
      //     trainingDay,
      //     dietPlan,
      //     supplements,
      //     supplementNotes:
      //       "乳清蛋白在训练后30分钟内服用，肌酸每天保持摄入，不需要周期性使用。",
      //     trainingCompletion,
      //     dietCompletion,
      //     supplementCompletion,
      //   });

      //   // 计算各时段补剂完成情况
      //   this.calculateSupplementsByTimeOfDay();

      //   wx.hideLoading();
      // }, 1000);
    } catch (error) {
      console.error("获取训练数据失败", error);
      wx.showToast({
        title: "获取训练数据失败",
        icon: "none",
      });
    }
    wx.hideLoading();
  },

  // 计算训练完成情况
  calculateTrainingCompletion(
    trainingDay: TrainingDay | null
  ): CompletionStatus {
    if (!trainingDay) {
      return {
        status: "incomplete",
        text: "无训练安排",
      };
    }

    const totalExercises = trainingDay.exercises.length;
    const completedExercises = trainingDay.exercises.filter(
      (e) => e.completed
    ).length;

    if (completedExercises === 0) {
      return {
        status: "incomplete",
        text: "未完成",
      };
    } else if (completedExercises === totalExercises) {
      return {
        status: "completed",
        text: "已完成",
      };
    } else {
      const percentage = Math.round(
        (completedExercises / totalExercises) * 100
      );
      return {
        status: "partial",
        text: `完成 ${percentage}%`,
      };
    }
  },

  // 计算饮食完成情况
  calculateDietCompletion(dietPlan: DietPlan): CompletionStatus {
    if (!dietPlan.meals || dietPlan.meals.length === 0) {
      return {
        status: "incomplete",
        text: "无饮食计划",
      };
    }

    const totalMeals = dietPlan.meals.length;
    const completedMeals = dietPlan.meals.filter((m) => m.completed).length;

    if (completedMeals === 0) {
      return {
        status: "incomplete",
        text: "未完成",
      };
    } else if (completedMeals === totalMeals) {
      return {
        status: "completed",
        text: "已完成",
      };
    } else {
      const percentage = Math.round((completedMeals / totalMeals) * 100);
      return {
        status: "partial",
        text: `完成 ${percentage}%`,
      };
    }
  },

  // 计算补剂完成情况
  calculateSupplementCompletion(supplements: Supplement[]): CompletionStatus {
    if (!supplements || supplements.length === 0) {
      return {
        status: "incomplete",
        text: "无补剂建议",
      };
    }

    const totalSupplements = supplements.length;
    const completedSupplements = supplements.filter((s) => s.completed).length;

    if (completedSupplements === 0) {
      return {
        status: "incomplete",
        text: "未完成",
      };
    } else if (completedSupplements === totalSupplements) {
      return {
        status: "completed",
        text: "已完成",
      };
    } else {
      const percentage = Math.round(
        (completedSupplements / totalSupplements) * 100
      );
      return {
        status: "partial",
        text: `完成 ${percentage}%`,
      };
    }
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

  // 切换标签页
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 日期选择器变更
  onDateChange(e: any) {
    const selectedDate = e.detail.value;
    const today = DateUtils.formatDate(new Date());
    const isToday = selectedDate === today;

    this.setData({
      selectedDate,
      isToday,
    });

    // 重新加载数据
    this.fetchTrainingData();

    // 获取新日期的审核状态
    // 实际应用中应该从服务器获取审核状态
    // request({
    //   url: `/api/training-review/${this.data.student.id}/${selectedDate}`,
    //   method: 'GET'
    // }).then(res => {
    //   this.setData({
    //     reviewStatus: res.data
    //   });
    // });

    // 模拟获取审核状态
    const mockReviewStatus = {
      isReviewed: false,
      reviewTime: "",
      reviewComments: "",
    };

    this.setData({
      reviewStatus: mockReviewStatus,
    });
  },

  // 前一天
  previousDay() {
    const currentDate = this.parseDate(this.data.selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const newDate = DateUtils.formatDate(currentDate);

    this.onDateChange({
      detail: {
        value: newDate,
      },
    });
  },

  // 后一天
  nextDay() {
    const currentDate = this.parseDate(this.data.selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const newDate = DateUtils.formatDate(currentDate);

    this.onDateChange({
      detail: {
        value: newDate,
      },
    });
  },

  // 编辑计划
  editPlan() {
    wx.navigateTo({
      url: `../planDetail/planDetail?id=${this.data.student.id}&from=todayTraining`,
    });
  },

  // 添加回复问题的方法
  answerQuestion(e: any) {
    const exerciseIndex = e.currentTarget.dataset.exerciseIndex;
    const exercise = this.data.trainingDay?.exercises[exerciseIndex];

    if (!exercise) return;

    wx.showModal({
      title: "回复学员问题",
      content: exercise.question || "",
      editable: true,
      placeholderText: "请输入您的回复...",
      success: (res) => {
        if (res.confirm && res.content) {
          // 实际应用中应该发送回复到服务器
          wx.showToast({
            title: "回复已发送",
            icon: "success",
          });

          // 可以选择在本地更新问题状态
          // const trainingDay = {...this.data.trainingDay};
          // trainingDay.exercises[exerciseIndex].questionAnswered = true;
          // this.setData({ trainingDay });
        }
      },
    });
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

  // 添加审核训练的方法
  reviewTraining() {
    wx.showModal({
      title: "审核训练",
      content: "请输入对学员今日训练的总体评价",
      editable: true,
      placeholderText: "例如：整体表现不错，注意加强胸肌发力...",
      success: (res) => {
        if (res.confirm) {
          // 获取当前时间
          const now = new Date();
          const reviewTime = `${now.getFullYear()}-${String(
            now.getMonth() + 1
          ).padStart(2, "0")}-${String(now.getDate()).padStart(
            2,
            "0"
          )} ${String(now.getHours()).padStart(2, "0")}:${String(
            now.getMinutes()
          ).padStart(2, "0")}`;

          // 更新审核状态
          this.setData({
            "reviewStatus.isReviewed": true,
            "reviewStatus.reviewTime": reviewTime,
            "reviewStatus.reviewComments": res.content || "已审核",
          });

          // 实际应用中应该将审核状态保存到服务器
          // request({
          //   url: `/api/training-review/${this.data.student.id}/${this.data.selectedDate}`,
          //   method: 'POST',
          //   data: {
          //     isReviewed: true,
          //     reviewTime: reviewTime,
          //     reviewComments: res.content || "已审核"
          //   }
          // });

          wx.showToast({
            title: "审核完成",
            icon: "success",
          });
        }
      },
    });
  },
});
