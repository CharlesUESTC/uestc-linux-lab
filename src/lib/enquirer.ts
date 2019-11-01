export interface Question {
  title: string;
  choices?: string[];
  answer: string;
}

/** 读取 json 格式的题库生成 enquirer.js 的 question 数组 */
export function questionGenerator(rawQuestion: Record<string, any>[]) {
  return rawQuestion.map((v: Question, index: number) => {
    if (!v.choices) {
      return {
        name: String(index),
        type: "input",
        message: `${index + 1}.${v.title}`
      };
    }

    return {
      name: String(index),
      type: "select",
      message: `${index + 1}.${v.title}`,
      choices: v.choices
    }
  })
}
