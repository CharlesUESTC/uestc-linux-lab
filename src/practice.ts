import { prompt } from "enquirer";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { questionGenerator, IQuestion } from "./lib/enquirer";
import { db } from "./lib/lowdb";

export const DIFFICULTY_LEVELS = [
  "easy",
  "medium",
  "hard"
]

export async function start(level: number) {
  terminal.clear();

  // 对查询到的结果进行一次深拷贝，防止被 enquirer.prompt 更改后写入DB
  const rawQuestions: IQuestion[] = JSON.parse(JSON.stringify(db.get("questions")
    // @ts-ignore
    .filter({ difficulty: DIFFICULTY_LEVELS[level]})
    .value()));

  console.log(rawQuestions);
  const response = await prompt(questionGenerator(rawQuestions));
  console.log(response);
  
  // 错题统计
  const userAnswers = Object.values(response);
  const result = {
    mistakes: [] as number[]
  };
  rawQuestions.forEach((question: IQuestion, index: number) => {
    if (question.answer !== userAnswers[index]) {
      result.mistakes.push(index)
    }
  });

  // 打印成绩单
  terminal.clear();

  terminal.cyan(`本次成绩: ${userAnswers.length - result.mistakes.length}/${userAnswers.length}\n`);
  if (result.mistakes.length > 0) {
    const answers = result.mistakes
      .map((index) => `第${index+1}题的正确答案为：${rawQuestions[index].answer}\n`)
      .join("");

    console.log(`错题解析：\n`);
    console.log(answers);
  } else {
    terminal.cyan(`全对啦👍继续努力！\n`);
  }
  // TODO: 存储统计数据

  // db.set("progress.overview", response).write();
}

export function selectDifficultyLevels() {
  terminal.clear();

  terminal.cyan("请选择难度：\n");
  terminal.singleColumnMenu(DIFFICULTY_LEVELS, (error: any, response: SingleColumnMenuResponse) => {
    start(response.selectedIndex);
  });
}
