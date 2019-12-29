import figlet from "figlet";
import { prompt } from "enquirer";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { questionGenerator, Question } from "../lib/enquirer";
import { db } from "../lib/lowdb";
import { random } from "../lib/util";
import { dataView } from "./data";

const LEVEL_ARRAY = ["easy", "medium", "hard"];

const LOGGED_MENU = [
  "                    开始答题                    ",
  "                    查看统计                    ",
  "                      关于                      ",
  "                      退出                      "
];

/**
 * 选择题目难度，进入不同难度的答题页
 * @param level 数字 0/1/2，按菜单顺序，0 为简单，1 为普通，2为困难
 */
 export async function practice(level: number) {
  terminal.clear();

  // TODO: 抽取选择题和填空题，排除已经答过的题目
  // 对查询到的结果进行一次深拷贝，防止被 enquirer.prompt 更改后写入DB
  let rawQuestions: Question[] = [];

  rawQuestions = random(db.get(`${LEVEL_ARRAY[level]}select`).value(), 2)
    .concat(random(db.get(`${LEVEL_ARRAY[level]}qa`).value(), 8)
  );

  if (!rawQuestions) {
    terminal.red("读取题库时发生错误");
    terminal.processExit(-2);
  }

  const response = await prompt(questionGenerator(rawQuestions));
  terminal.cyan(JSON.stringify(response));
  
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

  // TODO: render(<Report >)
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
  terminal.processExit(0)
}

function start(username: string) {
  terminal.cyan("请选择答题模式：\n");
  terminal.singleColumnMenu(["自选模式（选择题目难度）", "闯关模式（题目难度会逐渐递增）"], (error: any, response: SingleColumnMenuResponse) => {
    // 自选模式
    if(response.selectedIndex === 0) {
      terminal.cyan("请选择难度：\n");
      terminal.singleColumnMenu(["easy - 简单", "medium - 普通", "hard - 困难"], (error: any, response: SingleColumnMenuResponse) => {
        practice(response.selectedIndex).catch((e) => {
          console.log(e);
          terminal.processExit(-3);
        });
      });
    } else {
    // 闯关模式
      // TODO: 在自动难度模式下系统在用户连续答对或答错指定数量的题目后自动增加难度或降低难度。
      terminal.cyan("开发中，敬请期待");
      terminal.processExit(-4);
    }
  });
}

export function practiceView(username: string) {
  terminal.clear();

  terminal(figlet.textSync(`Hi! ${username}`, { horizontalLayout: "default" }))

  terminal.singleColumnMenu(LOGGED_MENU, (error: any, response: SingleColumnMenuResponse) => {
    if (error) {
      console.log(error);
      terminal.processExit(-1);
    }
    switch (response.selectedIndex) {
      case 0: //【开始答题】
        start(username);
        break;
      case 1: //【查看统计】
        dataView(username);
        break;
      case 2: //【退出】
      default:
        terminal.processExit(0);
    }
  });
}