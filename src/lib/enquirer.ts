export interface IQuestion {
  type: "sa" | "qa";
  title: string;
  choices?: string[];
  answer: string;
}

export const TYPE_MAP = {
  sa: "select",
  qa: "input"
};

/** 读取 json 格式的题库生成 enquirer.js 的 question 数组 */
export function questionGenerator(rawQuestion: Object[]) {
  return rawQuestion.map((v: IQuestion, index: number) => {
    let ret = {
      name: String(index),
      type: TYPE_MAP[v.type],
      message: `${index + 1}.${v.title}`
    } 

    if (v.type === "sa") {
      ret = Object.assign(ret, { choices: v.choices });
    }

    return ret;
  })
}
