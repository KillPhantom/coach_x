// 训练相关功能
import { Exercise, TrainingDay } from "./models";

// 获取训练计划
export function fetchTrainingPlan(studentId: number, page: any) {
  try {
    page.setData({
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
          focus: "胸部",
          exercises: [
            {
              name: "卧推",
              sets: [
                { weight: "15kg", reps: "12次" },
                { weight: "20kg", reps: "10次" },
                { weight: "25kg", reps: "8次" },
              ],
              note: "保持肩胛骨收紧，腹部紧张，手肘不要过度外展",
              highlight: "green",
            },
            {
              name: "哑铃飞鸟",
              sets: [
                { weight: "8kg", reps: "12次" },
                { weight: "10kg", reps: "10次" },
                { weight: "12kg", reps: "8次" },
              ],
              note: "控制动作速度，感受胸肌拉伸",
            },
            {
              name: "上斜卧推",
              sets: [
                { weight: "15kg", reps: "12次" },
                { weight: "17.5kg", reps: "10次" },
                { weight: "20kg", reps: "8次" },
              ],
            },
          ],
        },
        {
          day: "周四",
          focus: "腿部",
          exercises: [
            {
              name: "深蹲",
              sets: [
                { weight: "20kg", reps: "12次" },
                { weight: "30kg", reps: "10次" },
                { weight: "40kg", reps: "8次" },
                { weight: "50kg", reps: "6次" },
              ],
              note: "保持核心稳定，膝盖不要超过脚尖，下蹲至大腿与地面平行",
              highlight: "orange",
            },
            {
              name: "腿举",
              sets: [
                { weight: "50kg", reps: "12次" },
                { weight: "60kg", reps: "10次" },
                { weight: "70kg", reps: "8次" },
              ],
            },
            {
              name: "腿弯举",
              sets: [
                { weight: "20kg", reps: "12次" },
                { weight: "25kg", reps: "10次" },
                { weight: "30kg", reps: "8次" },
              ],
              note: "专注于收缩腿后肌群",
            },
          ],
        },
      ];

      page.setData({
        trainingDays,
        "loading.trainingDays": false,
      });
    }, 500);
  } catch (error) {
    console.error("获取训练计划失败", error);
    wx.showToast({
      title: "获取训练计划失败",
      icon: "none",
    });
    page.setData({
      "loading.trainingDays": false,
    });
  }
}

// 添加训练日
export function addTrainingDay(page: any) {
  wx.showModal({
    title: "添加训练日",
    content: "请输入训练日信息",
    editable: true,
    placeholderText: "例如：周二 (背部)",
    success: (res) => {
      if (res.confirm && res.content) {
        // 解析输入内容
        const parts = res.content.split(" ");
        if (parts.length >= 1) {
          const day = parts[0];
          const focus =
            parts.length > 1 ? parts[1].replace(/[()]/g, "") : "全身";

          // 添加新训练日
          const trainingDays = [...page.data.trainingDays];
          trainingDays.push({
            day,
            focus,
            exercises: [],
          });

          page.setData({
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
}

// 编辑训练日
export function editTrainingDay(page: any, e: any) {
  const dayIndex = e.currentTarget.dataset.dayIndex;
  const day = page.data.trainingDays[dayIndex];

  wx.showModal({
    title: "编辑训练日",
    content: `${day.day} (${day.focus})`,
    editable: true,
    success: (res) => {
      if (res.confirm && res.content) {
        // 解析输入内容
        const parts = res.content.split(" ");
        if (parts.length >= 1) {
          const dayName = parts[0];
          const focus =
            parts.length > 1 ? parts[1].replace(/[()]/g, "") : day.focus;

          // 更新训练日
          const trainingDays = [...page.data.trainingDays];
          trainingDays[dayIndex] = {
            ...trainingDays[dayIndex],
            day: dayName,
            focus,
          };

          page.setData({
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
}

// 删除训练日
export function deleteTrainingDay(page: any, e: any) {
  const dayIndex = e.currentTarget.dataset.dayIndex;

  wx.showModal({
    title: "删除训练日",
    content: "确定要删除这个训练日吗？",
    success: (res) => {
      if (res.confirm) {
        // 删除训练日
        const trainingDays = [...page.data.trainingDays];
        trainingDays.splice(dayIndex, 1);

        page.setData({
          trainingDays,
        });

        wx.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
}

// 添加训练动作
export function addExercise(page: any, e: any) {
  const dayIndex = e.currentTarget.dataset.dayIndex;

  // 直接进入详细添加界面
  detailAddExercise(page, dayIndex);
}

// 详细添加训练动作
export function detailAddExercise(page: any, dayIndex: number) {
  wx.showModal({
    title: "添加训练动作",
    content: "请输入动作名称",
    editable: true,
    placeholderText: "例如：卧推",
    success: (res) => {
      if (res.confirm && res.content) {
        const name = res.content.trim();

        if (name) {
          // 创建新动作（默认1组）
          const newExercise: Exercise = {
            name,
            sets: [{ weight: "0kg", reps: "10次" }],
          };

          // 添加到训练日
          const trainingDays = [...page.data.trainingDays];
          trainingDays[dayIndex].exercises.push(newExercise);

          page.setData({
            trainingDays,
          });

          // 添加完成后立即打开编辑界面，让用户设置组数和重量
          const exerciseIndex = trainingDays[dayIndex].exercises.length - 1;
          editExercise(page, {
            currentTarget: {
              dataset: {
                dayIndex,
                exerciseIndex,
              },
            },
          });
        }
      }
    },
  });
}

// 编辑训练动作
export function editExercise(page: any, e: any) {
  const dayIndex = e.currentTarget.dataset.dayIndex;
  const exerciseIndex = e.currentTarget.dataset.exerciseIndex;
  const exercise = page.data.trainingDays[dayIndex].exercises[exerciseIndex];

  wx.showActionSheet({
    itemList: ["编辑名称", "管理组数", "编辑教练提示", "设置高亮"],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          editExerciseName(page, dayIndex, exerciseIndex);
          break;
        case 1:
          manageSets(page, dayIndex, exerciseIndex);
          break;
        case 2:
          editExerciseNote(page, dayIndex, exerciseIndex);
          break;
        case 3:
          setExerciseHighlight(page, dayIndex, exerciseIndex);
          break;
      }
    },
  });
}

// 编辑动作名称
export function editExerciseName(
  page: any,
  dayIndex: number,
  exerciseIndex: number
) {
  const exercise = page.data.trainingDays[dayIndex].exercises[exerciseIndex];

  wx.showModal({
    title: "编辑动作名称",
    content: exercise.name,
    editable: true,
    success: (res) => {
      if (res.confirm && res.content) {
        // 更新动作名称
        const trainingDays = [...page.data.trainingDays];
        trainingDays[dayIndex].exercises[exerciseIndex].name = res.content;

        page.setData({
          trainingDays,
        });

        wx.showToast({
          title: "更新成功",
          icon: "success",
        });
      }
    },
  });
}

// 管理组数
export function manageSets(page: any, dayIndex: number, exerciseIndex: number) {
  wx.showActionSheet({
    itemList: ["添加新组", "编辑现有组", "删除组"],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          addSetToExercise(page, dayIndex, exerciseIndex);
          break;
        case 1:
          selectSetToEdit(page, dayIndex, exerciseIndex);
          break;
        case 2:
          selectSetToDelete(page, dayIndex, exerciseIndex);
          break;
      }
    },
  });
}

// 选择要编辑的组
export function selectSetToEdit(
  page: any,
  dayIndex: number,
  exerciseIndex: number
) {
  const exercise = page.data.trainingDays[dayIndex].exercises[exerciseIndex];
  const setItems = exercise.sets.map(
    (set, index) => `组${index + 1}: ${set.weight} × ${set.reps}`
  );

  wx.showActionSheet({
    itemList: setItems,
    success: (res) => {
      const setIndex = res.tapIndex;
      editSet(page, dayIndex, exerciseIndex, setIndex);
    },
  });
}

// 编辑特定组
export function editSet(
  page: any,
  dayIndex: number,
  exerciseIndex: number,
  setIndex: number
) {
  const set =
    page.data.trainingDays[dayIndex].exercises[exerciseIndex].sets[setIndex];

  wx.showModal({
    title: `编辑第${setIndex + 1}组`,
    content: `${set.weight} ${set.reps}`,
    editable: true,
    success: (res) => {
      if (res.confirm && res.content) {
        // 解析输入内容
        const parts = res.content.split(" ");
        if (parts.length >= 2) {
          const weight = parts[0];
          const reps = parts[1];

          // 更新组
          const trainingDays = [...page.data.trainingDays];
          trainingDays[dayIndex].exercises[exerciseIndex].sets[setIndex] = {
            weight,
            reps,
          };

          page.setData({
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
}

// 添加新组到现有动作
export function addSetToExercise(
  page: any,
  dayIndex: number,
  exerciseIndex: number
) {
  wx.showModal({
    title: "添加新组",
    content: "请输入重量和次数",
    editable: true,
    placeholderText: "例如：20kg 10次",
    success: (res) => {
      if (res.confirm && res.content) {
        // 解析输入内容
        const parts = res.content.split(" ");
        if (parts.length >= 2) {
          const weight = parts[0];
          const reps = parts[1];

          // 添加新组
          const trainingDays = [...page.data.trainingDays];
          trainingDays[dayIndex].exercises[exerciseIndex].sets.push({
            weight,
            reps,
          });

          page.setData({
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
}

// 选择要删除的组
export function selectSetToDelete(
  page: any,
  dayIndex: number,
  exerciseIndex: number
) {
  const exercise = page.data.trainingDays[dayIndex].exercises[exerciseIndex];
  const setItems = exercise.sets.map(
    (set, index) => `组${index + 1}: ${set.weight} × ${set.reps}`
  );

  wx.showActionSheet({
    itemList: setItems,
    success: (res) => {
      const setIndex = res.tapIndex;

      wx.showModal({
        title: "删除确认",
        content: `确定要删除第${setIndex + 1}组吗？`,
        success: (res) => {
          if (res.confirm) {
            // 删除组
            const trainingDays = [...page.data.trainingDays];
            trainingDays[dayIndex].exercises[exerciseIndex].sets.splice(
              setIndex,
              1
            );

            page.setData({
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
  });
}

// 编辑教练提示
export function editExerciseNote(
  page: any,
  dayIndex: number,
  exerciseIndex: number
) {
  const exercise = page.data.trainingDays[dayIndex].exercises[exerciseIndex];

  wx.showModal({
    title: "编辑教练提示",
    content: exercise.note || "",
    editable: true,
    success: (res) => {
      if (res.confirm) {
        // 更新教练提示
        const trainingDays = [...page.data.trainingDays];
        trainingDays[dayIndex].exercises[exerciseIndex].note = res.content;

        page.setData({
          trainingDays,
        });

        wx.showToast({
          title: "更新成功",
          icon: "success",
        });
      }
    },
  });
}

// 设置高亮
export function setExerciseHighlight(
  page: any,
  dayIndex: number,
  exerciseIndex: number
) {
  wx.showActionSheet({
    itemList: ["无高亮", "绿色高亮", "橙色高亮", "红色高亮"],
    success: (res) => {
      // 更新高亮
      const trainingDays = [...page.data.trainingDays];
      const highlights = [undefined, "green", "orange", "red"];
      trainingDays[dayIndex].exercises[exerciseIndex].highlight =
        highlights[res.tapIndex];

      page.setData({
        trainingDays,
      });

      wx.showToast({
        title: "更新成功",
        icon: "success",
      });
    },
  });
}

// 删除训练动作
export function deleteExercise(page: any, e: any) {
  const dayIndex = e.currentTarget.dataset.dayIndex;
  const exerciseIndex = e.currentTarget.dataset.exerciseIndex;

  wx.showModal({
    title: "删除训练动作",
    content: "确定要删除这个训练动作吗？",
    success: (res) => {
      if (res.confirm) {
        // 删除动作
        const trainingDays = [...page.data.trainingDays];
        trainingDays[dayIndex].exercises.splice(exerciseIndex, 1);

        page.setData({
          trainingDays,
        });

        wx.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
}
