/** db 表结构定义 */
export let db: {
  progress: {
    overview: any;
  },
  questions: {
    /** 题目难度，"easy" | "medium" | "hard" */
    difficulty: string,
    /** 题干 */
    title: string,
    /** 选择题选项 */
    choices?: string[];
  }[];
}