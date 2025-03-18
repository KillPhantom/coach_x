// 补剂相关功能
import { Supplement } from "./models";

// 获取补剂建议
export function fetchSupplements(studentId: number, page: any) {
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

      page.setData({
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
}

// 添加补剂
export function addSupplement(page: any) {
  wx.showModal({
    title: "添加补剂",
    content: "请输入补剂名称",
    editable: true,
    placeholderText: "例如：鱼油",
    success: (res) => {
      if (res.confirm && res.content) {
        const name = res.content.trim();

        if (name) {
          // 添加新补剂
          const supplements = [...page.data.supplements];
          supplements.push({
            name,
            dosage: "",
            morning: "",
            noon: "",
            evening: "",
          });

          page.setData({
            supplements,
          });

          // 添加完成后立即编辑剂量
          const supplementIndex = supplements.length - 1;
          editSupplementDosages(page, supplementIndex);
        }
      }
    },
  });
}

// 编辑补剂
export function editSupplement(page: any, e: any) {
  const supplementIndex = e.currentTarget.dataset.supplementIndex;
  const supplement = page.data.supplements[supplementIndex];

  wx.showModal({
    title: "编辑补剂名称",
    content: supplement.name,
    editable: true,
    success: (res) => {
      if (res.confirm && res.content) {
        const name = res.content.trim();

        if (name) {
          // 更新补剂名称
          const supplements = [...page.data.supplements];
          supplements[supplementIndex].name = name;

          page.setData({
            supplements,
          });

          wx.showToast({
            title: "更新成功",
            icon: "success",
          });
        }
      }
    },
  });
}

// 编辑补剂剂量
export function editSupplementDosage(page: any, e: any) {
  const supplementIndex = e.currentTarget.dataset.supplementIndex;
  const timeSlot = e.currentTarget.dataset.time;
  const supplement = page.data.supplements[supplementIndex];

  wx.showModal({
    title: `编辑${timeSlotName(timeSlot)}剂量`,
    content: supplement[timeSlot] || "",
    editable: true,
    placeholderText: "例如：1粒",
    success: (res) => {
      if (res.confirm) {
        // 更新剂量
        const supplements = [...page.data.supplements];
        supplements[supplementIndex][timeSlot] = res.content;

        page.setData({
          supplements,
        });

        wx.showToast({
          title: "更新成功",
          icon: "success",
        });
      }
    },
  });
}

// 一次性编辑所有时间段的剂量
export function editSupplementDosages(page: any, supplementIndex: number) {
  const supplement = page.data.supplements[supplementIndex];

  wx.showActionSheet({
    itemList: ["设置所有时间段相同剂量", "分别设置早中晚剂量"],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 设置所有时间段相同剂量
        wx.showModal({
          title: "设置剂量",
          content: "请输入所有时间段的剂量",
          editable: true,
          placeholderText: "例如：1粒",
          success: (res) => {
            if (res.confirm && res.content) {
              const dosage = res.content.trim();

              // 更新所有时间段
              const supplements = [...page.data.supplements];
              supplements[supplementIndex].morning = dosage;
              supplements[supplementIndex].noon = dosage;
              supplements[supplementIndex].evening = dosage;

              page.setData({
                supplements,
              });

              wx.showToast({
                title: "更新成功",
                icon: "success",
              });
            }
          },
        });
      } else {
        // 分别设置早中晚剂量
        editMorningDosage(page, supplementIndex);
      }
    },
  });
}

// 辅助函数：获取时间段名称
function timeSlotName(timeSlot: string): string {
  switch (timeSlot) {
    case "morning":
      return "早上";
    case "noon":
      return "中午";
    case "evening":
      return "晚上";
    default:
      return "";
  }
}

// 依次编辑早上剂量
function editMorningDosage(page: any, supplementIndex: number) {
  wx.showModal({
    title: "设置早上剂量",
    content: "",
    editable: true,
    placeholderText: "例如：1粒 (不需要则留空)",
    success: (res) => {
      if (res.confirm) {
        // 更新早上剂量
        const supplements = [...page.data.supplements];
        supplements[supplementIndex].morning = res.content;

        page.setData({
          supplements,
        });

        // 继续编辑中午剂量
        editNoonDosage(page, supplementIndex);
      }
    },
  });
}

// 编辑中午剂量
function editNoonDosage(page: any, supplementIndex: number) {
  wx.showModal({
    title: "设置中午剂量",
    content: "",
    editable: true,
    placeholderText: "例如：1粒 (不需要则留空)",
    success: (res) => {
      if (res.confirm) {
        // 更新中午剂量
        const supplements = [...page.data.supplements];
        supplements[supplementIndex].noon = res.content;

        page.setData({
          supplements,
        });

        // 继续编辑晚上剂量
        editEveningDosage(page, supplementIndex);
      }
    },
  });
}

// 编辑晚上剂量
function editEveningDosage(page: any, supplementIndex: number) {
  wx.showModal({
    title: "设置晚上剂量",
    content: "",
    editable: true,
    placeholderText: "例如：1粒 (不需要则留空)",
    success: (res) => {
      if (res.confirm) {
        // 更新晚上剂量
        const supplements = [...page.data.supplements];
        supplements[supplementIndex].evening = res.content;

        page.setData({
          supplements,
        });

        wx.showToast({
          title: "设置完成",
          icon: "success",
        });
      }
    },
  });
}

// 删除补剂
export function deleteSupplement(page: any, e: any) {
  const supplementIndex = e.currentTarget.dataset.supplementIndex;

  wx.showModal({
    title: "删除补剂",
    content: "确定要删除这个补剂吗？",
    success: (res) => {
      if (res.confirm) {
        // 删除补剂
        const supplements = [...page.data.supplements];
        supplements.splice(supplementIndex, 1);

        page.setData({
          supplements,
        });

        wx.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
}

// 编辑补剂注意事项
export function editSupplementNotes(page: any) {
  wx.showModal({
    title: "编辑补剂注意事项",
    content: page.data.supplementNotes || "",
    editable: true,
    success: (res) => {
      if (res.confirm) {
        // 更新注意事项
        page.setData({
          supplementNotes: res.content,
        });

        wx.showToast({
          title: "更新成功",
          icon: "success",
        });
      }
    },
  });
}
