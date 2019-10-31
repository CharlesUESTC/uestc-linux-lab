/** db 表结构定义 */
export let db: {
  progress: {
    overview: any;
  };
  easyselect: {
    /** 题干 */
    title: string;
    /** 选择题选项 */
    choices?: string[];
    /** 答案 */
    answer: string;
  }[];
  easyqa: {
    /** 题干 */
    title: string;
    /** 答案 */
    answer: string;
  }[];
}