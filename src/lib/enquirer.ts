export interface IQuestion {
  title: string;
  choices?: string[];
  answer: string;
}

/** 读取 json 格式的题库生成 enquirer.js 的 question 数组 */
export function questionGenerator(rawQuestion: Object[]) {
  return rawQuestion.map((v: IQuestion, index: number) => {
    let ret = {
      name: String(index),
      type: "input",
      message: `${index + 1}.${v.title}`
    } 

    return ret;
  })
}
