import figlet from "figlet";
import { prompt } from "enquirer";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { questionGenerator, Question } from "../lib/enquirer";
import { db } from "../lib/lowdb";
import { random } from "../lib/util";
import { dataView } from "./data";

/** enquirer.prompt 的返回值 */
export interface PromptRes {
  [index: string]: string;
}

/** 错题信息 */
export interface MistakeInfo {
  /** 题号 */
  index: string;
  /** 正确答案 */
  answer: string;
}

export interface JudgeResult {
  /** 完成题目数 */
  total: number;
  /** 正确题目数 */
  solved: number;
  /** 错题信息 */
  mistakes: MistakeInfo[];
}

const LEVEL_ARRAY = ["easy", "medium", "hard"];

const LOGGED_MENU = [
  "                    开始答题                    ",
  "                    查看统计                    ",
  "                      关于                      ",
  "                      退出                      "
];

// TODO: 抽取选择题和填空题，排除已经答过的题目
/** 根据难度值从题库中抽取题目 */
function getQuestions(level: number) {
  // 对查询到的结果进行一次深拷贝，防止被 enquirer.prompt 更改后写入DB
  let rawQuestions: Question[] = [];

  rawQuestions = random(db.get(`${LEVEL_ARRAY[level]}select`).value(), 2)
    .concat(random(db.get(`${LEVEL_ARRAY[level]}qa`).value(), 8)
  );

  if (!rawQuestions) {
    terminal.red("读取题库时发生错误");
    terminal.processExit(-2);
  }

  return rawQuestions;
}

/** 根据 response 判题 */
function judge(rawQuestions: Question[], response: PromptRes) {
  const userAnswers = Object.values(response);
  const result = {
    total: rawQuestions.length,
    solved: 0,
    mistakes: [] as MistakeInfo[]
  };
  rawQuestions.forEach((rawQuestion: Question, index: number) => {
    if (rawQuestion.answer !== userAnswers[index]) {
      result.mistakes.push({ index: String(index), answer: rawQuestion.answer });
    }
  });

  return result;
}

function printResult(result: JudgeResult) {
  terminal.cyan(`本次成绩: ${result.solved}/${result.total}\n`);
  if (result.mistakes.length > 0) {
    const answers = result.mistakes
      .map((mistake: MistakeInfo) => `第${mistake.index+1}题的正确答案为：${mistake.answer}`)
      .join("\n");

    console.log(`错题解析：\n`);
    console.log(answers);
  } else {
    terminal.cyan(`全对啦 👍👍👍 继续努力！\n`);
  }
}
/**
 * 选择题目难度，进入不同难度的答题页
 * @param level 数字 0/1/2，按菜单顺序，0 为简单，1 为普通，2为困难
 */
export async function practice(username: string, level: number) {
  terminal.clear();

  // 获取题目输出并获取用户输入
  const rawQuestions = getQuestions(level);
  const response: PromptRes = await prompt(questionGenerator(rawQuestions));
  
  // 错题统计
  const result = judge(rawQuestions, response);

  // 打印成绩单
  printResult(result);

  // TODO: 存储统计数据
  // db.set("overview", response).write();
  terminal.processExit(0)
}

/** 开始答题，选择模式与难度 */
function start(username: string) {
  terminal.cyan("请选择答题模式：\n");
  terminal.singleColumnMenu(["自选模式（选择题目难度）", "闯关模式（题目难度会逐渐递增）"], (error: any, response: SingleColumnMenuResponse) => {
    // 自选模式
    if(response.selectedIndex === 0) {
      terminal.cyan("请选择难度：\n");
      terminal.singleColumnMenu(["easy - 简单", "medium - 普通", "hard - 困难"], (error: any, response: SingleColumnMenuResponse) => {
        practice(username, response.selectedIndex).catch((e) => {
          console.log(e);
          terminal.processExit(-1);
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