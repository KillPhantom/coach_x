/**
 * 日期和时间工具函数
 */

export class DateUtils {
  /**
   * 将时间戳转换为"年月日"格式
   * @param timestamp 时间戳（毫秒）
   * @returns 格式化后的日期字符串，格式为"YYYY年MM月DD日"
   */
  static formatTimestampToDate(timestamp: number | string): string | undefined {
    if (!timestamp) return undefined;

    try {
      // 确保时间戳是数字
      const ts = typeof timestamp === "string" ? Number(timestamp) : timestamp;
      if (isNaN(ts)) return undefined;

      const date = new Date(ts);
      // 检查日期是否有效
      if (isNaN(date.getTime())) return undefined;

      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() 返回 0-11
      const day = date.getDate();

      return `${year}年${month}月${day}日`;
    } catch (e) {
      console.error("格式化时间戳失败:", e);
      return undefined;
    }
  }

  /**
   * 计算相对时间（几天前、几小时前等）
   * @param timestamp 时间戳（毫秒）
   * @returns 相对时间字符串
   */
  static formatRelativeTime(timestamp: number | string): string {
    if (!timestamp) return "未知时间";

    try {
      // 确保时间戳是数字
      const ts = typeof timestamp === "string" ? Number(timestamp) : timestamp;
      if (isNaN(ts)) return "未知时间";

      const now = Date.now();
      const date = new Date(ts);
      // 检查日期是否有效
      if (isNaN(date.getTime())) return "未知时间";

      // 计算时间差（毫秒）
      const diff = now - ts;

      // 转换为秒
      const seconds = Math.floor(diff / 1000);

      // 不同时间单位的秒数
      const minute = 60;
      const hour = minute * 60;
      const day = hour * 24;
      const week = day * 7;
      const month = day * 30;
      const year = day * 365;

      // 根据时间差返回不同的描述
      if (seconds < 0) {
        return "刚刚"; // 未来时间（可能是时钟不同步）
      } else if (seconds < minute) {
        return "刚刚";
      } else if (seconds < hour) {
        const minutes = Math.floor(seconds / minute);
        return `${minutes}分钟前`;
      } else if (seconds < day) {
        const hours = Math.floor(seconds / hour);
        return `${hours}小时前`;
      } else if (seconds < week) {
        const days = Math.floor(seconds / day);
        return `${days}天前`;
      } else if (seconds < month) {
        const weeks = Math.floor(seconds / week);
        return `${weeks}周前`;
      } else if (seconds < year) {
        const months = Math.floor(seconds / month);
        return `${months}个月前`;
      } else {
        const years = Math.floor(seconds / year);
        return `${years}年前`;
      }
    } catch (e) {
      console.error("计算相对时间失败:", e);
      return "未知时间";
    }
  }

  /**
   * 判断日期是否是今天
   * @param timestamp 时间戳（毫秒）
   * @returns 是否是今天
   */
  static isToday(timestamp: number | string): boolean {
    try {
      const ts = typeof timestamp === "string" ? Number(timestamp) : timestamp;
      if (isNaN(ts)) return false;

      const date = new Date(ts);
      const today = new Date();

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * 格式化为更友好的相对时间（今天显示具体时间）
   * @param timestamp 时间戳（毫秒）
   * @returns 友好的时间字符串
   */
  static formatFriendlyTime(timestamp: number | string): string {
    if (!timestamp) return "未知时间";

    try {
      const ts = typeof timestamp === "string" ? Number(timestamp) : timestamp;
      if (isNaN(ts)) return "未知时间";

      // 如果是今天，显示"今天 HH:MM"
      if (this.isToday(ts)) {
        const date = new Date(ts);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `今天 ${hours}:${minutes}`;
      }

      // 否则显示相对时间
      return this.formatRelativeTime(ts);
    } catch (e) {
      return "未知时间";
    }
  }

  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // 获取日期的时间戳 (UTC 零点)
}
