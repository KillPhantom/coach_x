// 训练计划详情页面
import { request } from "../../utils/request";
import { PageData, Student, AIAnalysis } from "./models";
import * as TrainingController from "./trainingController";
import * as DietController from "./dietController";
import * as SupplementController from "./supplementController";

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

interface ExerciseSet {
  weight: string;
  reps: string;
}

interface Exercise {
  name: string;
  sets: ExerciseSet[];
  note?: string;
  highlight?: string;
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
  } as PageData,

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

    // 检查是否是新计划
    const isNewPlan = options.isNew === "true";

    if (isNewPlan) {
      // 如果是新计划，初始化空数据
      this.initNewPlan();
    } else {
      // 获取学员ID
      const studentId = parseInt(options.id || "1");

      // 加载数据
      this.fetchStudentData(studentId);
      this.fetchAIAnalysis(studentId);
      TrainingController.fetchTrainingPlan(studentId, this);
      DietController.fetchDietPlan(studentId, this);
      SupplementController.fetchSupplements(studentId, this);
    }
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
      //   url: `/api/students/${studentId}/ai-analysis`,
      //   method: 'GET'
      // });

      // 模拟从服务器获取数据
      setTimeout(() => {
        const aiAnalysis = {
          suggestions: [
            "增加深蹲训练强度，目前进步速度低于预期",
            "考虑增加蛋白质摄入，建议达到每天2g/kg体重",
            "睡眠质量不足，建议调整作息，确保每晚7-8小时高质量睡眠",
          ],
          weeks: 8,
          tests: 3,
        };

        this.setData({
          aiAnalysis,
          "loading.aiAnalysis": false,
        });
      }, 1000);
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

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 切换底部标签页
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab,
    });

    // 根据标签页跳转到相应页面
    if (tab !== this.data.previousPage) {
      wx.redirectTo({
        url: `../${tab}/${tab}`,
      });
    }
  },

  // 切换计划标签页
  switchPlanTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
    });
  },

  // 应用AI建议
  applyAISuggestions() {
    wx.showToast({
      title: "已应用AI建议",
      icon: "success",
    });
  },

  // 训练相关方法
  addTrainingDay() {
    TrainingController.addTrainingDay(this);
  },

  editTrainingDay(e: any) {
    TrainingController.editTrainingDay(this, e);
  },

  deleteTrainingDay(e: any) {
    TrainingController.deleteTrainingDay(this, e);
  },

  addExercise(e: any) {
    TrainingController.addExercise(this, e);
  },

  editExercise(e: any) {
    TrainingController.editExercise(this, e);
  },

  deleteExercise(e: any) {
    TrainingController.deleteExercise(this, e);
  },

  // 饮食相关方法
  editMacros() {
    DietController.editMacros(this);
  },

  addMeal() {
    DietController.addMeal(this);
  },

  addFood(e: any) {
    DietController.addFood(this, e);
  },

  editFood(e: any) {
    DietController.editFood(this, e);
  },

  deleteFood(e: any) {
    DietController.deleteFood(this, e);
  },

  editDietNotes() {
    DietController.editDietNotes(this);
  },

  // 补剂相关方法
  addSupplement() {
    SupplementController.addSupplement(this);
  },

  editSupplement(e: any) {
    SupplementController.editSupplement(this, e);
  },

  deleteSupplement(e: any) {
    SupplementController.deleteSupplement(this, e);
  },

  editSupplementNotes() {
    SupplementController.editSupplementNotes(this);
  },

  deleteMeal(e: any) {
    DietController.deleteMeal(this, e);
  },

  quickAddMeal() {
    DietController.quickAddMeal(this);
  },

  editSupplementDosage(e: any) {
    SupplementController.editSupplementDosage(this, e);
  },

  // 保存计划
  savePlan() {
    wx.showLoading({
      title: "保存中...",
    });

    // 准备要发送的数据 - 包含所有三个部分作为一个整体
    const planData = {
      studentId: this.data.student.id,
      planName: this.data.student.planName,
      planData: {
        trainingDays: this.data.trainingDays,
        dietPlan: this.data.dietPlan,
        supplements: this.data.supplements,
        supplementNotes: this.data.supplementNotes,
      },
    };

    // 实际应用中应该发送到服务器
    // request({
    //   url: '/api/training-plans',
    //   method: 'POST',
    //   data: planData
    // }).then(() => {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '保存成功',
    //     icon: 'success'
    //   });
    // }).catch(error => {
    //   console.error('保存计划失败', error);
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '保存失败',
    //     icon: 'none'
    //   });
    // });

    // 模拟发送到服务器
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: "保存成功",
        icon: "success",
        duration: 2000,
      });
    }, 1500);
  },

  // 显示模板操作选项
  showTemplateOptions() {
    wx.showActionSheet({
      itemList: ["保存为预设模板", "插入预设模板"],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.saveAsTemplate();
        } else if (res.tapIndex === 1) {
          this.insertTemplate();
        }
      },
    });
  },

  // 保存为预设模板
  saveAsTemplate() {
    wx.showModal({
      title: "保存为预设模板",
      content: "请输入模板名称",
      editable: true,
      placeholderText: "例如：初级增肌计划",
      success: (res) => {
        if (res.confirm && res.content) {
          const templateName = res.content.trim();

          if (templateName) {
            wx.showLoading({
              title: "保存中...",
            });

            // 准备要保存的模板数据 - 包含所有三个部分
            const templateData = {
              name: templateName,
              description: `${this.data.student.name}的训练计划模板`,
              category: this.data.student.phase.replace("期", ""),
              level: "自定义",
              duration: `${this.data.student.week}周`,
              planData: {
                trainingDays: this.data.trainingDays,
                dietPlan: this.data.dietPlan,
                supplements: this.data.supplements,
                supplementNotes: this.data.supplementNotes,
              },
            };

            // 实际应用中应该发送到服务器
            // request({
            //   url: '/api/templates',
            //   method: 'POST',
            //   data: templateData
            // }).then(() => {
            //   wx.hideLoading();
            //   wx.showToast({
            //     title: '模板保存成功',
            //     icon: 'success'
            //   });
            // }).catch(error => {
            //   console.error('保存模板失败', error);
            //   wx.hideLoading();
            //   wx.showToast({
            //     title: '保存失败',
            //     icon: 'none'
            //   });
            // });

            // 模拟发送到服务器
            setTimeout(() => {
              wx.hideLoading();
              wx.showToast({
                title: "模板保存成功",
                icon: "success",
                duration: 2000,
              });
            }, 1000);
          }
        }
      },
    });
  },

  // 插入预设模板
  insertTemplate() {
    wx.showLoading({
      title: "加载模板...",
    });

    // 实际应用中应该从服务器获取模板列表
    // request({
    //   url: '/api/templates',
    //   method: 'GET'
    // }).then(res => {
    //   const templates = res.data;
    //   this.showTemplateList(templates);
    // }).catch(error => {
    //   console.error('获取模板列表失败', error);
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '获取模板失败',
    //     icon: 'none'
    //   });
    // });

    // 模拟从服务器获取数据
    setTimeout(() => {
      wx.hideLoading();

      // 模拟模板列表数据
      const templates = [
        {
          id: 1,
          name: "初级增肌计划",
          description: "适合初学者的全身增肌训练计划",
        },
        {
          id: 2,
          name: "中级增肌计划",
          description: "适合有一定基础的训练者，分化训练",
        },
        {
          id: 3,
          name: "高级增肌计划",
          description: "高强度、高频率的增肌计划",
        },
        {
          id: 4,
          name: "减脂塑形计划",
          description: "结合力量训练和有氧训练，帮助减脂塑形",
        },
        {
          id: 5,
          name: "功能性训练计划",
          description: "提高整体运动能力和身体机能的训练计划",
        },
      ];

      this.showTemplateList(templates);
    }, 500);
  },

  // 显示模板列表
  showTemplateList(templates: any[]) {
    if (templates.length === 0) {
      wx.showToast({
        title: "暂无可用模板",
        icon: "none",
      });
      return;
    }

    wx.showActionSheet({
      itemList: templates.map((t) => t.name),
      success: (res) => {
        const selectedTemplate = templates[res.tapIndex];

        wx.showModal({
          title: "应用模板",
          content: `确定要应用"${selectedTemplate.name}"模板吗？这将替换当前的所有计划内容。`,
          success: (res) => {
            if (res.confirm) {
              wx.showLoading({
                title: "应用模板中...",
              });

              // 模拟从服务器获取模板详情
              setTimeout(() => {
                // 获取模板数据
                const templateData = this.getMockTemplateData(
                  selectedTemplate.id
                );

                // 应用模板数据
                this.applyTemplate(templateData);

                // 隐藏加载提示并显示成功提示
                wx.hideLoading();
                wx.showToast({
                  title: "模板应用成功",
                  icon: "success",
                  duration: 2000,
                });
              }, 500);
            }
          },
        });
      },
    });
  },

  // 获取当前模板数据
  getTemplateData() {
    // 返回完整的计划数据
    return {
      trainingDays: this.data.trainingDays,
      dietPlan: this.data.dietPlan,
      supplements: this.data.supplements,
      supplementNotes: this.data.supplementNotes,
    };
  },

  // 应用模板
  applyTemplate(templateData: any) {
    console.log("应用模板数据:", templateData);

    // 根据模板ID的不同，应用不同类型的模板数据
    if (templateData.length > 0) {
      // 如果是训练计划模板（数组格式）
      this.setData({
        trainingDays: templateData,
      });
    } else if (templateData.calories !== undefined) {
      // 如果是饮食计划模板
      this.setData({
        dietPlan: templateData,
      });
    } else if (templateData.supplements !== undefined) {
      // 如果是补剂建议模板
      this.setData({
        supplements: templateData.supplements,
        supplementNotes: templateData.notes || "",
      });
    } else if (templateData.planData) {
      // 如果是完整的计划数据
      this.setData({
        trainingDays: templateData.planData.trainingDays || [],
        dietPlan: templateData.planData.dietPlan || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          meals: [],
        },
        supplements: templateData.planData.supplements || [],
        supplementNotes: templateData.planData.supplementNotes || "",
      });
    }
  },

  // 获取标签页名称
  getTabName() {
    switch (this.data.activeTab) {
      case "training":
        return "训练计划";
      case "diet":
        return "饮食计划";
      case "supplements":
        return "补剂建议";
      default:
        return "";
    }
  },

  // 模拟获取模板数据（实际应用中应该从服务器获取）
  getMockTemplateData(templateId: number) {
    // 这里只是示例数据，实际应用中应该从服务器获取
    const mockTemplates: any = {
      // 训练计划模板
      1: {
        planData: {
          trainingDays: [
            {
              day: "周一",
              focus: "胸部/肩部",
              exercises: [
                {
                  name: "平板杠铃卧推",
                  sets: [
                    { weight: "60kg", reps: "12次" },
                    { weight: "70kg", reps: "10次" },
                    { weight: "80kg", reps: "8次" },
                    { weight: "85kg", reps: "6次" },
                  ],
                  note: "注意肩膀下沉，胸部挺起",
                },
                {
                  name: "上斜哑铃卧推",
                  sets: [
                    { weight: "22kg", reps: "12次" },
                    { weight: "24kg", reps: "10次" },
                    { weight: "26kg", reps: "8次" },
                  ],
                },
                {
                  name: "坐姿哑铃肩推",
                  sets: [
                    { weight: "18kg", reps: "12次" },
                    { weight: "20kg", reps: "10次" },
                    { weight: "22kg", reps: "8次" },
                  ],
                },
              ],
            },
            {
              day: "周三",
              focus: "背部/二头肌",
              exercises: [
                {
                  name: "引体向上",
                  sets: [
                    { weight: "体重", reps: "10次" },
                    { weight: "体重", reps: "8次" },
                    { weight: "体重", reps: "6次" },
                  ],
                },
                {
                  name: "坐姿划船",
                  sets: [
                    { weight: "60kg", reps: "12次" },
                    { weight: "70kg", reps: "10次" },
                    { weight: "80kg", reps: "8次" },
                  ],
                },
              ],
            },
            {
              day: "周五",
              focus: "腿部/三头肌",
              exercises: [
                {
                  name: "杠铃深蹲",
                  sets: [
                    { weight: "80kg", reps: "12次" },
                    { weight: "90kg", reps: "10次" },
                    { weight: "100kg", reps: "8次" },
                    { weight: "110kg", reps: "6次" },
                  ],
                  note: "注意膝盖不要超过脚尖",
                },
                {
                  name: "腿举",
                  sets: [
                    { weight: "120kg", reps: "12次" },
                    { weight: "140kg", reps: "10次" },
                    { weight: "160kg", reps: "8次" },
                  ],
                },
              ],
            },
          ],
          dietPlan: {
            calories: 2200,
            protein: 180,
            carbs: 220,
            fat: 60,
            meals: [
              {
                name: "早餐",
                time: "",
                foods: [
                  { name: "全麦面包", amount: "2片" },
                  { name: "鸡蛋", amount: "3个" },
                  { name: "牛奶", amount: "250ml" },
                ],
              },
              {
                name: "午餐",
                time: "",
                foods: [
                  { name: "糙米", amount: "100g" },
                  { name: "鸡胸肉", amount: "150g" },
                  { name: "西兰花", amount: "100g" },
                  { name: "橄榄油", amount: "1茶匙" },
                ],
              },
              {
                name: "晚餐",
                time: "",
                foods: [
                  { name: "红薯", amount: "150g" },
                  { name: "三文鱼", amount: "150g" },
                  { name: "混合蔬菜", amount: "200g" },
                ],
              },
            ],
            notes: "每天饮水至少2升，避免加工食品和精制糖。",
          },
          supplements: [
            {
              name: "乳清蛋白",
              dosage: "30g",
              morning: "",
              noon: "",
              evening: "1勺",
            },
            {
              name: "肌酸",
              dosage: "5g",
              morning: "5g",
              noon: "",
              evening: "",
            },
            {
              name: "鱼油",
              dosage: "1000mg",
              morning: "1粒",
              noon: "",
              evening: "1粒",
            },
            {
              name: "维生素D",
              dosage: "2000IU",
              morning: "1粒",
              noon: "",
              evening: "",
            },
          ],
          supplementNotes:
            "乳清蛋白在训练后30分钟内服用，肌酸每天保持摄入，不需要周期性使用。",
        },
      },

      // 其他模板...
      2: {
        planData: {
          // 中级增肌计划数据...
          trainingDays: [
            // 训练日数据...
          ],
          dietPlan: {
            // 饮食计划数据...
          },
          supplements: [
            // 补剂数据...
          ],
          supplementNotes: "补剂说明...",
        },
      },

      // 更多模板...
    };

    return mockTemplates[templateId] || {};
  },

  // 初始化新计划
  initNewPlan() {
    // 设置一个空的计划数据
    this.setData({
      student: {
        id: 0,
        name: "新计划",
        avatar: "新",
        avatarStyle: "background-color: #1890ff; color: white;",
        phase: "自定义",
        phaseTagClass: "tag-custom",
        week: 1,
        planName: "未命名计划",
        height: 0,
        weight: 0,
        weightChange: 0,
      },
      aiAnalysis: null, // 不显示AI分析
      trainingDays: [], // 空的训练计划
      dietPlan: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        meals: [],
      },
      supplements: [], // 空的补剂建议
      supplementNotes: "",
      loading: {
        aiAnalysis: false,
        trainingDays: false,
      },
    });
  },
});
