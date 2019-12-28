export enum CommendCategory {
  Undefined = "",
  Filesystem = "Filesystem",
  Processes = "Processes",
  Network = "Network",
  Misc = "Misc",
  TextProcessing = "TextProcessing",
  System = "System",
  Shell = "Shell"
}

/** db 表结构定义 */
export let db: {
  progress: {
    overview: any;
  };
  select: {
    /** 题干 */
    title: string;
    /** 选择题选项 */
    choices?: string[];
    /** 答案 */
    answer: string;
    /** 类别 */
    category: CommendCategory;
  }[];
  qa: {
    /** 题干 */
    title: string;
    /** 答案 */
    answer: string;
    /** 类别 */
    category: CommendCategory;
  }[];
}