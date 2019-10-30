interface IQuestion {
  id: string;
  type: "sa" | "qa";
  title: string;
  choices?: string[];
  answer: string;
}

const TYPE_MAP = {
  sa: "select",
  qa: "input"
};

/** 读取 json 格式的题库生成 enquirer.js 的 question 数组 */
export function questionGenerator(rawQuestion: Object[]) {
  return rawQuestion.map((v: IQuestion) => {
    let ret = {
      name: v.id,
      type: TYPE_MAP[v.type],
      message: v.title
    } 

    if (v.type === "sa") {
      ret = Object.assign(ret, { choices: v.choices });
    }

    return ret;
  })
}
