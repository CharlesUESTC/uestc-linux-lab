/** db 表结构定义 */
export let db: {
  progress: {
    overview: any;
  },
  questions: {
    /** 题目ID */
    id: string,
    /** 题目类型，"sa"(选择题) | "qa"(简答题) */
    type: string,
    /** 题目难度，"easy" | "medium" | "hard" */
    difficulty: string,
    /** 题干 */
    title: string,
    /** 选择题选项 */
    choices?: string[];
  }[];
}