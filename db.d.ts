export enum CommendCategory {
  Others = "",
  Filesystem = "Filesystem",
  Processes = "Processes",
  Network = "Network",
  Misc = "Misc",
  TextProcessing = "TextProcessing",
  System = "System",
  Shell = "Shell"
}

export interface Select {
  /** 题号 */
  id: number;
  /** 难度 */
  difficulty?: "easy" | "medium" | "hard";
  /** 题干 */
  title: string;
  /** 选择题选项 */
  choices?: string[];
  /** 答案 */
  answer: string;
  /** 类别 */
  category: CommendCategory;
}

export interface QuestionAndAnswer {
  /** 题号 */
  id: number;
  /** 难度 */
  difficulty?: "easy" | "medium" | "hard";
  /** 题干 */
  title: string;
  /** 答案 */
  answer: string;
  /** 类别 */
  category: CommendCategory;
}

export interface UserProfile {
  // 已解决的题目数
  solved: number;
  // 准确率(0-100)
  correctRate: number;
  // 分类答题情况
  details: {
    Filesystem: number;
    Processes: number;
    Network: number;
    Misc: number;
    TextProcessing: number;
    System: number;
    Shell: number;
    Others: number;
  };
}

/** db 表结构定义 */
export let db: {
  overview: {
    // 题目总数
    total: number;
    // 各类别下题目数
    Filesystem: number;
    Processes: number;
    Network: number;
    Misc: number;
    TextProcessing: number;
    System: number;
    Shell: number;
    Others: number;
  };
  // 个人信息
  profiles: {
    [username: string]: UserProfile;
  };
  easyqa: QuestionAndAnswer[];
  mediumqa: QuestionAndAnswer[];
  hardqa: QuestionAndAnswer[];
  easyselect: Select[];
  mediumselect: Select[];
  hardselect: Select[];
}

