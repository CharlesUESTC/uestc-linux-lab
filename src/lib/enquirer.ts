export interface Question {
  title: string;
  choices?: string[];
  answer: string;
}

/** 读取 json 格式的题库生成 enquirer.js 的 question 数组 */
export function questionGenerator(rawQuestion: Record<string, any>[]) {
  return rawQuestion.map((v: Question, index: number) => {
    // 题库格式有误
    if (!v.title) {
      return {
        name: String(index),
        type: "error",
        message: `${index + 1}.（无标题）`,
        choices: v.choices
      }
    }
    // 填空题
    if (!v.choices) {
      return {
        name: String(index),
        type: "input",
        message: `${index + 1}.${v.title}`
      };
    }

    // 选择题
    return {
      name: String(index),
      type: "select",
      message: `${index + 1}.${v.title}`,
      choices: v.choices
    }
  })
}
