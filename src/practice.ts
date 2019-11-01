import { prompt } from "enquirer";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { questionGenerator, Question } from "./lib/enquirer";
import { db } from "./lib/lowdb";
import { random } from "./lib/util";

/**
 * 选择题目难度，进入不同难度的答题页
 * @param level 数字 0/1/2，按菜单顺序，0 为简单，1 为普通，2为困难
 */
 export async function selectDifficultyLevels(level: number) {
  terminal.clear();

  // TODO: 抽取选择题和填空题，排除已经答过的题目
  // 对查询到的结果进行一次深拷贝，防止被 enquirer.prompt 更改后写入DB
  let rawQuestions: Question[] = [];

  rawQuestions = random(db.get("easyselect").value(), 2).concat(
    random(db.get("easyqa").value(), 8)
  );

  if (rawQuestions.length === 0) {
    terminal.red("读取题库时发生错误");
    process.exit();
  }

  const response = await prompt(questionGenerator(rawQuestions));
  
  // 错题统计
  const userAnswers = Object.values(response);
  const result = {
    mistakes: [] as number[]
  };
  rawQuestions.forEach((question: Question, index: number) => {
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
    terminal.cyan(`全对啦 👍👍👍 继续努力！\n`);
  }
  // TODO: 存储统计数据

  // db.set("progress.overview", response).write();
}

export function start() {
  terminal.clear();

  terminal.cyan("请选择模式：\n");
  terminal.singleColumnMenu(["【自选模式】", "【闯关模式】"], (error: any, response: SingleColumnMenuResponse) => {
    if(response.selectedIndex === 0) {
      terminal.cyan("请选择难度：\n");
      terminal.singleColumnMenu(["【简单】", "【普通】", "【困难】"], (error: any, response: SingleColumnMenuResponse) => {
        selectDifficultyLevels(response.selectedIndex).catch((e) => {
          console.log(e);
          process.exit();
        });
      });
    } else {
      // TODO: 在自动难度模式下系统在用户连续答对或答错指定数量的题目后自动增加难度或降低难度。
      terminal.cyan("开发中，敬请期待");
      process.exit();
    }
  });
}
