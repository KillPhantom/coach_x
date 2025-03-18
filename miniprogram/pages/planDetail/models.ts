// 所有数据模型定义

// 学员信息
export interface Student {
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

// AI分析
export interface AIAnalysis {
  suggestions: string[];
  weeks: number;
  tests: number;
}

// 训练相关
export interface ExerciseSet {
  weight: string;
  reps: string;
}

export interface Exercise {
  name: string;
  sets: ExerciseSet[];
  note?: string;
  highlight?: string;
}

export interface TrainingDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

// 饮食相关
export interface MealFood {
  name: string;
  amount: string;
}

export interface Meal {
  name: string;
  time: string;
  foods: MealFood[];
}

export interface DietPlan {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: Meal[];
  notes?: string;
}

// 补剂相关
export interface Supplement {
  name: string;
  dosage: string;
  morning?: string; // 早上剂量
  noon?: string; // 中午剂量
  evening?: string; // 晚上剂量
  note?: string; // 补充说明
}

// 页面数据
export interface PageData {
  statusBarHeight: number;
  currentTab: string;
  student: Student;
  aiAnalysis: AIAnalysis;
  trainingDays: TrainingDay[];
  loading: {
    aiAnalysis: boolean;
    trainingDays: boolean;
  };
  previousPage: string;
  activeTab: string;
  dietPlan: DietPlan;
  supplements: Supplement[];
  supplementNotes: string;
}
