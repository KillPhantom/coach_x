// 训练计划详情页面
import { request } from "../../utils/request";

interface Student {
  id: number;
  name: string;
  avatar: string;
  avatarStyle: string;
  phase: string;
  phaseTagClass: string;
  week: number;
  planName: string;
  height: number;
  weight: number;
  weightChange: number;
}

interface AIAnalysis {
  suggestions: string[];
  weeks: number;
  tests: number;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  highlight?: string; // green, orange, red
}

interface TrainingDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

// 添加饮食计划接口
interface MealFood {
  name: string;
  amount: string;
}

interface Meal {
  name: string;
  time: string;
  foods: MealFood[];
}

interface DietPlan {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: Meal[];
  notes?: string;
}

// 添加补剂接口
interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
}

Page({
  data: {
    statusBarHeight: 0,
    currentTab: "training", // 默认选中的标签页
    student: {} as Student,
    aiAnalysis: {} as AIAnalysis,
    trainingDays: [] as TrainingDay[],
    loading: {
      aiAnalysis: true,
      trainingDays: true,
    },
    previousPage: "", // 记录来源页面，用于返回
    activeTab: "training", // 默认显示训练标签页
    dietPlan: {} as DietPlan,
    supplements: [] as Supplement[],
    supplementNotes: "",
  },

  onLoad(options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;

    // 设置标题栏高度
    this.setData({
      statusBarHeight: statusBarHeight,
      previousPage: options.from || "training", // 记录来源页面
      currentTab: options.from || "training", // 设置当前标签页
    });

    // 获取学员ID
    const studentId = parseInt(options.id || "1");

    // 加载数据
    this.fetchStudentData(studentId);
    this.fetchAIAnalysis(studentId);
    this.fetchTrainingPlan(studentId);
    this.fetchDietPlan(studentId);
    this.fetchSupplements(studentId);
  },

  // 获取学员数据
  async fetchStudentData(studentId: number) {
    try {
      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: `/api/students/${studentId}`,
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const student = {
          id: studentId,
          name: "张三",
          avatar: "张",
          avatarStyle: "",
          phase: "增肌期",
          phaseTagClass: "tag-bulking",
          week: 8,
          planName: "初级增肌计划",
          height: 178,
          weight: 75.5,
          weightChange: 0.8,
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

  // 获取AI分析
  async fetchAIAnalysis(studentId: number) {
    try {
      this.setData({
        "loading.aiAnalysis": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: `/api/students/${studentId}/analysis`,
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const aiAnalysis = {
          suggestions: [
            "卧推进步迅速，可以增加5kg重量",
            "深蹲技术需要改进，建议减少重量并优化姿势",
            "背部肌群发展不均衡，建议增加下背部训练",
          ],
          weeks: 8,
          tests: 4,
        };

        this.setData({
          aiAnalysis,
          "loading.aiAnalysis": false,
        });
      }, 800);
    } catch (error) {
      console.error("获取AI分析失败", error);
      wx.showToast({
        title: "获取AI分析失败",
        icon: "none",
      });
      this.setData({
        "loading.aiAnalysis": false,
      });
    }
  },

  // 获取训练计划
  async fetchTrainingPlan(studentId: number) {
    try {
      this.setData({
        "loading.trainingDays": true,
      });

      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: `/api/students/${studentId}/training-plan`,
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const trainingDays = [
          {
            day: "周一",
            focus: "胸部, 肩部",
            exercises: [
              {
                name: "卧推",
                sets: 5,
                reps: "5次",
                weight: "80kg",
                highlight: "green",
              },
              {
                name: "上斜哑铃卧推",
                sets: 4,
                reps: "8次",
                weight: "25kg/只",
              },
              {
                name: "肩上推举",
                sets: 4,
                reps: "8次",
                weight: "40kg",
              },
            ],
          },
          {
            day: "周二",
            focus: "背部",
            exercises: [
              {
                name: "硬拉",
                sets: 5,
                reps: "5次",
                weight: "120kg",
              },
              {
                name: "引体向上",
                sets: 4,
                reps: "最大次数",
                weight: "每组至少8次",
              },
              {
                name: "坐姿划船",
                sets: 4,
                reps: "10次",
                weight: "60kg",
                highlight: "orange",
              },
            ],
          },
          {
            day: "周四",
            focus: "腿部",
            exercises: [
              {
                name: "深蹲",
                sets: 5,
                reps: "5次",
                weight: "100kg",
                highlight: "red",
              },
              {
                name: "腿举",
                sets: 4,
                reps: "10次",
                weight: "150kg",
              },
            ],
          },
        ];

        this.setData({
          trainingDays,
          "loading.trainingDays": false,
        });
      }, 600);
    } catch (error) {
      console.error("获取训练计划失败", error);
      wx.showToast({
        title: "获取训练计划失败",
        icon: "none",
      });
      this.setData({
        "loading.trainingDays": false,
      });
    }
  },

  // 应用AI建议
  applyAISuggestions() {
    wx.showLoading({
      title: "应用AI建议中...",
      mask: true,
    });

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: "AI建议已应用",
        icon: "success",
      });

      // 刷新训练计划
      this.fetchTrainingPlan(this.data.student.id);
    }, 1500);
  },

  // 返回上一页
  goBack() {
    // 根据来源页面返回
    if (this.data.previousPage === "students") {
      wx.redirectTo({ url: "/pages/students/students" });
    } else {
      wx.redirectTo({ url: "/pages/training/training" });
    }
  },

  // 切换底部标签页
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;

    if (tab === this.data.currentTab) return;

    this.setData({
      currentTab: tab,
    });

    // 根据标签切换页面
    if (tab === "assistant") {
      wx.redirectTo({ url: "/pages/coachX/coachX" });
    } else if (tab === "students") {
      wx.redirectTo({ url: "/pages/students/students" });
    } else if (tab === "training") {
      wx.redirectTo({ url: "/pages/training/training" });
    }
  },

  // 获取饮食计划数据
  async fetchDietPlan(studentId: number) {
    try {
      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: `/api/students/${studentId}/diet-plan`,
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const dietPlan = {
          calories: 3000,
          protein: 180,
          carbs: 350,
          fat: 80,
          meals: [
            {
              name: "早餐",
              time: "7:00 - 8:00",
              foods: [
                { name: "全麦面包", amount: "2片" },
                { name: "鸡蛋", amount: "3个" },
                { name: "牛奶", amount: "250ml" },
                { name: "香蕉", amount: "1个" },
              ],
            },
            {
              name: "上午加餐",
              time: "10:30",
              foods: [
                { name: "希腊酸奶", amount: "200g" },
                { name: "蓝莓", amount: "50g" },
                { name: "杏仁", amount: "30g" },
              ],
            },
            {
              name: "午餐",
              time: "12:30 - 13:30",
              foods: [
                { name: "糙米", amount: "150g" },
                { name: "鸡胸肉", amount: "150g" },
                { name: "西兰花", amount: "100g" },
                { name: "橄榄油", amount: "1勺" },
              ],
            },
            {
              name: "训练前",
              time: "训练前30分钟",
              foods: [
                { name: "香蕉", amount: "1个" },
                { name: "蛋白棒", amount: "1条" },
              ],
            },
            {
              name: "训练后",
              time: "训练后30分钟内",
              foods: [
                { name: "蛋白粉", amount: "30g" },
                { name: "快速碳水", amount: "50g" },
              ],
            },
            {
              name: "晚餐",
              time: "19:00 - 20:00",
              foods: [
                { name: "红薯", amount: "200g" },
                { name: "三文鱼", amount: "150g" },
                { name: "混合蔬菜", amount: "150g" },
                { name: "橄榄油", amount: "1勺" },
              ],
            },
          ],
          notes:
            "训练日增加碳水摄入，非训练日减少100g碳水。保持充分水分摄入，每天至少2.5升水。",
        };

        this.setData({
          dietPlan,
        });
      }, 500);
    } catch (error) {
      console.error("获取饮食计划失败", error);
      wx.showToast({
        title: "获取饮食计划失败",
        icon: "none",
      });
    }
  },

  // 获取补剂建议数据
  async fetchSupplements(studentId: number) {
    try {
      // 实际应用中应该从服务器获取数据
      // const res = await request({
      //   url: `/api/students/${studentId}/supplements`,
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const supplements = [
          {
            name: "乳清蛋白",
            dosage: "30g",
            timing: "训练后和早餐",
            purpose: "促进肌肉恢复和生长",
          },
          {
            name: "肌酸",
            dosage: "5g",
            timing: "每天，训练日在训练前",
            purpose: "增加力量和爆发力",
          },
          {
            name: "BCAA",
            dosage: "10g",
            timing: "训练中",
            purpose: "减少肌肉分解，促进恢复",
          },
          {
            name: "鱼油",
            dosage: "3g",
            timing: "早餐和晚餐",
            purpose: "减少炎症，促进关节健康",
          },
          {
            name: "维生素D",
            dosage: "2000IU",
            timing: "早餐",
            purpose: "支持免疫系统和骨骼健康",
          },
        ];

        const supplementNotes =
          "所有补剂都应在医生或营养师的指导下使用。补剂不能替代均衡饮食，只是作为补充。";

        this.setData({
          supplements,
          supplementNotes,
        });
      }, 500);
    } catch (error) {
      console.error("获取补剂建议失败", error);
      wx.showToast({
        title: "获取补剂建议失败",
        icon: "none",
      });
    }
  },

  // 切换标签页
  switchPlanTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
    });
  },

  // 训练动作相关方法
  // 添加训练动作
  addExercise(e: any) {
    const dayIndex = e.currentTarget.dataset.dayIndex;

    wx.showModal({
      title: "添加训练动作",
      content: "请输入训练动作信息",
      editable: true,
      placeholderText: "例如：卧推 4组x10次 80kg",
      success: (res) => {
        if (res.confirm && res.content) {
          // 解析输入内容
          const parts = res.content.split(" ");
          if (parts.length >= 3) {
            const name = parts[0];
            const setsReps = parts[1].split("x");
            const sets = parseInt(setsReps[0]);
            const reps = setsReps[1];
            const weight = parts[2];

            // 添加新动作
            const trainingDays = [...this.data.trainingDays];
            trainingDays[dayIndex].exercises.push({
              name,
              sets,
              reps,
              weight,
            });

            this.setData({
              trainingDays,
            });

            wx.showToast({
              title: "添加成功",
              icon: "success",
            });
          } else {
            wx.showToast({
              title: "格式错误",
              icon: "none",
            });
          }
        }
      },
    });
  },

  // 编辑训练动作
  editExercise(e: any) {
    const dayIndex = e.currentTarget.dataset.dayIndex;
    const exerciseIndex = e.currentTarget.dataset.exerciseIndex;
    const exercise = this.data.trainingDays[dayIndex].exercises[exerciseIndex];

    wx.showModal({
      title: "编辑训练动作",
      content: `${exercise.name} ${exercise.sets}组x${exercise.reps} ${exercise.weight}`,
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          // 解析输入内容
          const parts = res.content.split(" ");
          if (parts.length >= 3) {
            const name = parts[0];
            const setsReps = parts[1].split("x");
            const sets = parseInt(setsReps[0]);
            const reps = setsReps[1];
            const weight = parts[2];

            // 更新动作
            const trainingDays = [...this.data.trainingDays];
            trainingDays[dayIndex].exercises[exerciseIndex] = {
              name,
              sets,
              reps,
              weight,
              highlight: exercise.highlight,
            };

            this.setData({
              trainingDays,
            });

            wx.showToast({
              title: "更新成功",
              icon: "success",
            });
          } else {
            wx.showToast({
              title: "格式错误",
              icon: "none",
            });
          }
        }
      },
    });
  },

  // 删除训练动作
  deleteExercise(e: any) {
    const dayIndex = e.currentTarget.dataset.dayIndex;
    const exerciseIndex = e.currentTarget.dataset.exerciseIndex;

    wx.showModal({
      title: "删除训练动作",
      content: "确定要删除这个训练动作吗？",
      success: (res) => {
        if (res.confirm) {
          // 删除动作
          const trainingDays = [...this.data.trainingDays];
          trainingDays[dayIndex].exercises.splice(exerciseIndex, 1);

          this.setData({
            trainingDays,
          });

          wx.showToast({
            title: "删除成功",
            icon: "success",
          });
        }
      },
    });
  },

  // 饮食计划相关方法
  // 编辑宏量营养素
  editMacros() {
    wx.showModal({
      title: "编辑宏量营养素",
      content: `热量: ${this.data.dietPlan.calories}kcal, 蛋白质: ${this.data.dietPlan.protein}g, 碳水: ${this.data.dietPlan.carbs}g, 脂肪: ${this.data.dietPlan.fat}g`,
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          // 解析输入内容
          const parts = res.content.split(", ");
          if (parts.length >= 4) {
            const calories = parseInt(parts[0].split(": ")[1]);
            const protein = parseInt(parts[1].split(": ")[1]);
            const carbs = parseInt(parts[2].split(": ")[1]);
            const fat = parseInt(parts[3].split(": ")[1]);

            // 更新宏量营养素
            const dietPlan = { ...this.data.dietPlan };
            dietPlan.calories = calories;
            dietPlan.protein = protein;
            dietPlan.carbs = carbs;
            dietPlan.fat = fat;

            this.setData({
              dietPlan,
            });

            wx.showToast({
              title: "更新成功",
              icon: "success",
            });
          } else {
            wx.showToast({
              title: "格式错误",
              icon: "none",
            });
          }
        }
      },
    });
  },

  // 添加餐次
  addMeal() {
    wx.showModal({
      title: "添加餐次",
      content: "请输入餐次名称和时间",
      editable: true,
      placeholderText: "例如：加餐 15:00",
      success: (res) => {
        if (res.confirm && res.content) {
          // 解析输入内容
          const parts = res.content.split(" ");
          if (parts.length >= 2) {
            const name = parts[0];
            const time = parts[1];

            // 添加新餐次
            const dietPlan = { ...this.data.dietPlan };
            dietPlan.meals.push({
              name,
              time,
              foods: [],
            });

            this.setData({
              dietPlan,
            });

            wx.showToast({
              title: "添加成功",
              icon: "success",
            });
          } else {
            wx.showToast({
              title: "格式错误",
              icon: "none",
            });
          }
        }
      },
    });
  },

  // 添加食物
  addFood(e: any) {
    const mealIndex = e.currentTarget.dataset.mealIndex;

    wx.showModal({
      title: "添加食物",
      content: "请输入食物名称和数量",
      editable: true,
      placeholderText: "例如：鸡胸肉 100g",
      success: (res) => {
        if (res.confirm && res.content) {
          // 解析输入内容
          const parts = res.content.split(" ");
          if (parts.length >= 2) {
            const name = parts[0];
            const amount = parts[1];

            // 添加新食物
            const dietPlan = { ...this.data.dietPlan };
            dietPlan.meals[mealIndex].foods.push({
              name,
              amount,
            });

            this.setData({
              dietPlan,
            });

            wx.showToast({
              title: "添加成功",
              icon: "success",
            });
          } else {
            wx.showToast({
              title: "格式错误",
              icon: "none",
            });
          }
        }
      },
    });
  },

  // 编辑食物
  editFood(e: any) {
    const mealIndex = e.currentTarget.dataset.mealIndex;
    const foodIndex = e.currentTarget.dataset.foodIndex;
    const food = this.data.dietPlan.meals[mealIndex].foods[foodIndex];

    wx.showModal({
      title: "编辑食物",
      content: `${food.name} ${food.amount}`,
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          // 解析输入内容
          const parts = res.content.split(" ");
          if (parts.length >= 2) {
            const name = parts[0];
            const amount = parts[1];

            // 更新食物
            const dietPlan = { ...this.data.dietPlan };
            dietPlan.meals[mealIndex].foods[foodIndex] = {
              name,
              amount,
            };

            this.setData({
              dietPlan,
            });

            wx.showToast({
              title: "更新成功",
              icon: "success",
            });
          } else {
            wx.showToast({
              title: "格式错误",
              icon: "none",
            });
          }
        }
      },
    });
  },

  // 删除食物
  deleteFood(e: any) {
    const mealIndex = e.currentTarget.dataset.mealIndex;
    const foodIndex = e.currentTarget.dataset.foodIndex;

    wx.showModal({
      title: "删除食物",
      content: "确定要删除这个食物吗？",
      success: (res) => {
        if (res.confirm) {
          // 删除食物
          const dietPlan = { ...this.data.dietPlan };
          dietPlan.meals[mealIndex].foods.splice(foodIndex, 1);

          this.setData({
            dietPlan,
          });

          wx.showToast({
            title: "删除成功",
            icon: "success",
          });
        }
      },
    });
  },

  // 编辑饮食注意事项
  editDietNotes() {
    wx.showModal({
      title: "编辑饮食注意事项",
      content: this.data.dietPlan.notes || "",
      editable: true,
      success: (res) => {
        if (res.confirm) {
          // 更新注意事项
          const dietPlan = { ...this.data.dietPlan };
          dietPlan.notes = res.content;

          this.setData({
            dietPlan,
          });

          wx.showToast({
            title: "更新成功",
            icon: "success",
          });
        }
      },
    });
  },

  // 补剂建议相关方法
  // 添加补剂
  addSupplement() {
    wx.showModal({
      title: "添加补剂",
      content: "请输入补剂信息",
      editable: true,
      placeholderText: "例如：维生素C 1000mg 早餐 增强免疫力",
      success: (res) => {
        if (res.confirm && res.content) {
          // 解析输入内容
          const parts = res.content.split(" ");
          if (parts.length >= 4) {
            const name = parts[0];
            const dosage = parts[1];
            const timing = parts[2];
            const purpose = parts.slice(3).join(" ");

            // 添加新补剂
            const supplements = [...this.data.supplements];
            supplements.push({
              name,
              dosage,
              timing,
              purpose,
            });

            this.setData({
              supplements,
            });

            wx.showToast({
              title: "添加成功",
              icon: "success",
            });
          } else {
            wx.showToast({
              title: "格式错误",
              icon: "none",
            });
          }
        }
      },
    });
  },

  // 编辑补剂
  editSupplement(e: any) {
    const supplementIndex = e.currentTarget.dataset.supplementIndex;
    const supplement = this.data.supplements[supplementIndex];

    wx.showModal({
      title: "编辑补剂",
      content: `${supplement.name} ${supplement.dosage} ${supplement.timing} ${supplement.purpose}`,
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          // 解析输入内容
          const parts = res.content.split(" ");
          if (parts.length >= 4) {
            const name = parts[0];
            const dosage = parts[1];
            const timing = parts[2];
            const purpose = parts.slice(3).join(" ");

            // 更新补剂
            const supplements = [...this.data.supplements];
            supplements[supplementIndex] = {
              name,
              dosage,
              timing,
              purpose,
            };

            this.setData({
              supplements,
            });

            wx.showToast({
              title: "更新成功",
              icon: "success",
            });
          } else {
            wx.showToast({
              title: "格式错误",
              icon: "none",
            });
          }
        }
      },
    });
  },

  // 删除补剂
  deleteSupplement(e: any) {
    const supplementIndex = e.currentTarget.dataset.supplementIndex;

    wx.showModal({
      title: "删除补剂",
      content: "确定要删除这个补剂吗？",
      success: (res) => {
        if (res.confirm) {
          // 删除补剂
          const supplements = [...this.data.supplements];
          supplements.splice(supplementIndex, 1);

          this.setData({
            supplements,
          });

          wx.showToast({
            title: "删除成功",
            icon: "success",
          });
        }
      },
    });
  },

  // 编辑补剂注意事项
  editSupplementNotes() {
    wx.showModal({
      title: "编辑补剂注意事项",
      content: this.data.supplementNotes || "",
      editable: true,
      success: (res) => {
        if (res.confirm) {
          // 更新注意事项
          this.setData({
            supplementNotes: res.content,
          });

          wx.showToast({
            title: "更新成功",
            icon: "success",
          });
        }
      },
    });
  },
});
