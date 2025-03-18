// 饮食相关功能
import { DietPlan } from "./models";

// 获取饮食计划
export function fetchDietPlan(studentId: number, page: any) {
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
            time: "10:00 - 10:30",
            foods: [
              { name: "希腊酸奶", amount: "200g" },
              { name: "蓝莓", amount: "50g" },
              { name: "杏仁", amount: "30g" },
            ],
          },
          {
            name: "午餐",
            time: "12:00 - 13:00",
            foods: [
              { name: "糙米", amount: "150g" },
              { name: "鸡胸肉", amount: "150g" },
              { name: "西兰花", amount: "100g" },
              { name: "橄榄油", amount: "1勺" },
            ],
          },
          {
            name: "训练前",
            time: "15:30 - 16:00",
            foods: [
              { name: "香蕉", amount: "1个" },
              { name: "蛋白棒", amount: "1条" },
            ],
          },
          {
            name: "训练后",
            time: "18:00 - 18:30",
            foods: [
              { name: "蛋白粉", amount: "30g" },
              { name: "快速碳水", amount: "50g" },
            ],
          },
          {
            name: "晚餐",
            time: "19:30 - 20:30",
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

      page.setData({
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
}

// 编辑宏量营养素
export function editMacros(page: any) {
  const dietPlan = page.data.dietPlan;

  wx.showModal({
    title: "编辑宏量营养素",
    content: `${dietPlan.calories}kcal ${dietPlan.protein}g蛋白 ${dietPlan.carbs}g碳水 ${dietPlan.fat}g脂肪`,
    editable: true,
    success: (res) => {
      if (res.confirm && res.content) {
        // 解析输入内容
        const parts = res.content.split(" ");
        if (parts.length >= 4) {
          const calories = parseInt(parts[0]);
          const protein = parseInt(parts[1]);
          const carbs = parseInt(parts[2]);
          const fat = parseInt(parts[3]);

          if (
            !isNaN(calories) &&
            !isNaN(protein) &&
            !isNaN(carbs) &&
            !isNaN(fat)
          ) {
            // 更新宏量
            const updatedDietPlan = { ...page.data.dietPlan };
            updatedDietPlan.calories = calories;
            updatedDietPlan.protein = protein;
            updatedDietPlan.carbs = carbs;
            updatedDietPlan.fat = fat;

            page.setData({
              dietPlan: updatedDietPlan,
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
        } else {
          wx.showToast({
            title: "格式错误",
            icon: "none",
          });
        }
      }
    },
  });
}

// 添加餐次
export function addMeal(page: any) {
  wx.showModal({
    title: "添加餐次",
    content: "请输入餐次名称",
    editable: true,
    placeholderText: "例如：下午茶",
    success: (res) => {
      if (res.confirm && res.content) {
        const mealName = res.content.trim();

        if (mealName) {
          // 检查是否已存在该餐次
          const dietPlan = { ...page.data.dietPlan };
          const existingMealIndex = dietPlan.meals.findIndex(
            (meal) => meal.name === mealName
          );

          if (existingMealIndex !== -1) {
            wx.showToast({
              title: "该餐次已存在",
              icon: "none",
            });
            return;
          }

          // 添加新餐次
          dietPlan.meals.push({
            name: mealName,
            time: "", // 不再需要时间
            foods: [],
          });

          page.setData({
            dietPlan,
          });

          wx.showToast({
            title: "添加成功",
            icon: "success",
          });
        } else {
          wx.showToast({
            title: "请输入餐次名称",
            icon: "none",
          });
        }
      }
    },
  });
}

// 添加食物
export function addFood(page: any, e: any) {
  const mealIndex = e.currentTarget.dataset.mealIndex;

  wx.showModal({
    title: "添加食物",
    content: "请输入食物名称和数量",
    editable: true,
    placeholderText: "例如：鸡胸肉 150g",
    success: (res) => {
      if (res.confirm && res.content) {
        // 解析输入内容
        const parts = res.content.split(" ");
        if (parts.length >= 2) {
          const name = parts[0];
          const amount = parts[1];

          // 添加新食物
          const dietPlan = { ...page.data.dietPlan };
          dietPlan.meals[mealIndex].foods.push({
            name,
            amount,
          });

          page.setData({
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
}

// 编辑食物
export function editFood(page: any, e: any) {
  const mealIndex = e.currentTarget.dataset.mealIndex;
  const foodIndex = e.currentTarget.dataset.foodIndex;
  const food = page.data.dietPlan.meals[mealIndex].foods[foodIndex];

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
          const dietPlan = { ...page.data.dietPlan };
          dietPlan.meals[mealIndex].foods[foodIndex] = {
            name,
            amount,
          };

          page.setData({
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
}

// 删除食物
export function deleteFood(page: any, e: any) {
  const mealIndex = e.currentTarget.dataset.mealIndex;
  const foodIndex = e.currentTarget.dataset.foodIndex;

  wx.showModal({
    title: "删除食物",
    content: "确定要删除这个食物吗？",
    success: (res) => {
      if (res.confirm) {
        // 删除食物
        const dietPlan = { ...page.data.dietPlan };
        dietPlan.meals[mealIndex].foods.splice(foodIndex, 1);

        page.setData({
          dietPlan,
        });

        wx.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
}

// 编辑饮食注意事项
export function editDietNotes(page: any) {
  wx.showModal({
    title: "编辑饮食注意事项",
    content: page.data.dietPlan.notes || "",
    editable: true,
    success: (res) => {
      if (res.confirm) {
        // 更新注意事项
        const dietPlan = { ...page.data.dietPlan };
        dietPlan.notes = res.content;

        page.setData({
          dietPlan,
        });

        wx.showToast({
          title: "更新成功",
          icon: "success",
        });
      }
    },
  });
}

// 删除餐次
export function deleteMeal(page: any, e: any) {
  const mealIndex = e.currentTarget.dataset.mealIndex;
  const mealName = page.data.dietPlan.meals[mealIndex].name;

  wx.showModal({
    title: "删除餐次",
    content: `确定要删除"${mealName}"吗？`,
    success: (res) => {
      if (res.confirm) {
        // 删除餐次
        const dietPlan = { ...page.data.dietPlan };
        dietPlan.meals.splice(mealIndex, 1);

        page.setData({
          dietPlan,
        });

        wx.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
}

// 快速添加常见餐次
export function quickAddMeal(page: any) {
  wx.showActionSheet({
    itemList: ["早餐", "午餐", "晚餐", "训练前", "训练后", "加餐"],
    success: (res) => {
      const mealTypes = ["早餐", "午餐", "晚餐", "训练前", "训练后", "加餐"];
      const selectedMeal = mealTypes[res.tapIndex];

      // 检查是否已存在该餐次
      const dietPlan = { ...page.data.dietPlan };
      const existingMealIndex = dietPlan.meals.findIndex(
        (meal) => meal.name === selectedMeal
      );

      if (existingMealIndex !== -1) {
        wx.showToast({
          title: "该餐次已存在",
          icon: "none",
        });
        return;
      }

      // 添加预设餐次
      let newMeal = {
        name: selectedMeal,
        time: "",
        foods: [],
      };

      // 根据餐次类型添加常见食物
      switch (selectedMeal) {
        case "早餐":
          newMeal.foods = [
            { name: "全麦面包", amount: "2片" },
            { name: "鸡蛋", amount: "2个" },
            { name: "牛奶", amount: "250ml" },
          ];
          break;
        case "午餐":
          newMeal.foods = [
            { name: "米饭", amount: "150g" },
            { name: "鸡胸肉", amount: "120g" },
            { name: "西兰花", amount: "100g" },
          ];
          break;
        case "晚餐":
          newMeal.foods = [
            { name: "红薯", amount: "150g" },
            { name: "三文鱼", amount: "120g" },
            { name: "混合蔬菜", amount: "150g" },
          ];
          break;
        case "训练前":
          newMeal.foods = [
            { name: "香蕉", amount: "1个" },
            { name: "蛋白棒", amount: "1条" },
          ];
          break;
        case "训练后":
          newMeal.foods = [
            { name: "蛋白粉", amount: "30g" },
            { name: "快速碳水", amount: "50g" },
          ];
          break;
        case "加餐":
          newMeal.foods = [
            { name: "希腊酸奶", amount: "200g" },
            { name: "蓝莓", amount: "50g" },
            { name: "杏仁", amount: "30g" },
          ];
          break;
      }

      dietPlan.meals.push(newMeal);

      page.setData({
        dietPlan,
      });

      wx.showToast({
        title: "添加成功",
        icon: "success",
      });
    },
  });
}
