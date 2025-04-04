import { UserService, IUserInfo } from "./userService";

// 分页信息接口
export interface IPagination {
  total: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

// 学生查询结果接口
export interface IStudentsResult {
  success: boolean;
  students: any;
  pagination: IPagination;
  message?: string;
}

// 学生服务类
export class FetchStudentsService {
  // 缓存学生数据，避免频繁请求
  private static studentCache: IUserInfo[] = [];

  // 当前分页状态
  private static currentPagination: IPagination = {
    total: 0,
    pageSize: 10,
    pageNumber: 1,
    totalPages: 0,
  };

  // 是否正在加载
  private static isLoading: boolean = false;

  // 最后加载时间（用于缓存过期判断）
  private static lastLoadTime: number = 0;

  // 缓存过期时间（毫秒），默认1分钟
  private static cacheExpiry: number = 60000;

  // 初始化服务
  static initialize() {
    this.studentCache = [];
    this.currentPagination = {
      total: 0,
      pageSize: 10,
      pageNumber: 1,
      totalPages: 0,
    };
    this.isLoading = false;
    this.lastLoadTime = 0;
  }

  // 获取缓存的所有学生
  static getCachedStudents(): IUserInfo[] {
    return this.studentCache;
  }

  // 获取当前分页状态
  static getPagination(): IPagination {
    return this.currentPagination;
  }

  // 检查缓存是否有效
  static isCacheValid(): boolean {
    return (
      this.studentCache.length > 0 &&
      Date.now() - this.lastLoadTime < this.cacheExpiry
    );
  }

  // 设置分页大小
  static setPageSize(size: number) {
    this.currentPagination.pageSize = size;
    // 重置页码
    this.currentPagination.pageNumber = 1;
  }

  // 设置页码
  static setPageNumber(pageNumber: number) {
    this.currentPagination.pageNumber = pageNumber;
  }

  // 获取学生数据（带分页）
  static async fetchStudents(forceRefresh = false): Promise<IStudentsResult> {
    // 如果正在加载，返回缓存或空数据
    if (this.isLoading) {
      return {
        success: true,
        students: this.studentCache,
        pagination: this.currentPagination,
        message: "正在加载中，返回缓存数据",
      };
    }

    // 如果缓存有效且不强制刷新，直接返回缓存
    if (this.isCacheValid() && !forceRefresh) {
      return {
        success: true,
        students: this.studentCache,
        pagination: this.currentPagination,
      };
    }

    try {
      this.isLoading = true;
      // 调用云函数获取数据
      const result = await wx.cloud.callFunction({
        name: "fetchStudents",
        data: {
          pageSize: this.currentPagination.pageSize,
          pageNumber: this.currentPagination.pageNumber,
        },
      });

      this.isLoading = false;

      const data = result.result as IStudentsResult;

      if (data.success) {
        // 使用 UserService.parseUserInfo 处理每个学生数据
        const parsedStudents = data.students.records.map((student: any) =>
          UserService.parseUserInfo(student)
        );

        // 更新缓存和分页信息
        this.studentCache = parsedStudents;
        this.currentPagination = data.pagination;
        this.lastLoadTime = Date.now();

        // 返回解析后的数据
        return {
          success: true,
          students: parsedStudents,
          pagination: data.pagination,
        };
      }
      return data;
    } catch (error) {
      this.isLoading = false;
      console.error("获取学生列表失败", error);

      return {
        success: false,
        students: this.studentCache,
        pagination: this.currentPagination,
        message: "获取学生列表失败: " + error,
      };
    }
  }

  // 获取特定学生
  static getStudentById(studentId: string): IUserInfo | null {
    return (
      this.studentCache.find((student) => student.openId === studentId) || null
    );
  }

  // 强制刷新数据
  static async refreshStudents(): Promise<IStudentsResult> {
    return this.fetchStudents(true);
  }

  // 加载下一页
  static async loadNextPage(): Promise<IStudentsResult> {
    if (this.currentPagination.pageNumber < this.currentPagination.totalPages) {
      this.currentPagination.pageNumber += 1;
      return this.fetchStudents(true);
    }

    return {
      success: true,
      students: this.studentCache,
      pagination: this.currentPagination,
      message: "已是最后一页",
    };
  }

  // 清除缓存
  static clearCache() {
    this.studentCache = [];
    this.lastLoadTime = 0;
  }
}
