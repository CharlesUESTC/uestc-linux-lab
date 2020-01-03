import figlet from "figlet";
import { prompt } from "enquirer";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { questionGenerator, Question } from "../lib/enquirer";
import { db } from "../lib/lowdb";
import { random } from "../lib/util";
import { dataView } from "./data";
import { UserProfile } from "../types/db";

/** enquirer.prompt 的返回值 */
export interface PromptRes {
  [index: string]: string;
}

/** 错题信息 */
export interface MistakeInfo {
  /** 题号 */
  index: number;
  /** 题干 */
  title: string;
  /** 正确答案 */
  answer: string;
  /** 错误答案 */
  wrong: string;
}

/** 判题结果 */
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
function getQuestions(level: number, count: number, type = "qa") {
  // 对查询到的结果进行一次深拷贝，防止被 enquirer.prompt 更改后写入DB
  let questions: Question[] = [];

  // rawQuestions = random(db.get(`${LEVEL_ARRAY[level]}select`).value(), 2)
  //   .concat(random(db.get(`${LEVEL_ARRAY[level]}qa`).value(), 8)
  // );

  questions = random(db.get(`${LEVEL_ARRAY[level]}${type}`).value(), count);

  if (!questions) {
    terminal.red("读取题库时发生错误");
    terminal.processExit(-2);
  }

  return questions;
}

// TODO: 去重
/** 根据 response 判题 */
function judge(rawQuestions: Question[], response: PromptRes) {
  const userAnswers = Object.values(response);
  const result = {
    total: rawQuestions.length,
    solved: 0,
    mistakes: [] as MistakeInfo[]
  };
  rawQuestions.forEach((rawQuestion: Question, index: number) => {
    // TODO: isEqual(rawQuestion.answer, userAnswers[index])
    if (rawQuestion.answer === userAnswers[index]) {
      result.solved += 1;
    } else {
      result.mistakes.push({
        index,
        title: rawQuestion.title,
        answer: rawQuestion.answer,
        wrong: userAnswers[index]
      });
    }
  });

  return result;
}

/** 将判题结果保存到 db.json */
function saveResult(username: string, result: JudgeResult) {
  db.update(`profiles.${username}`, (userProfile: UserProfile) => {
    userProfile.solved += result.solved;
    userProfile.times += 1;
    userProfile.correctRate = userProfile.solved / (userProfile.times * result.total);
    return userProfile;
  }).write();
}

/**
 * 进入固定难度模式练习
 * @param username 用户名，用于统计答题情况
 * @param level 练习难度，取值范围为数字 0/1/2，按菜单顺序，0 为简单，1 为普通，2 为困难
 */
export async function regularMode(username: string, level: number) {
  terminal.clear();

  // TODO: 改进题型
  // 固定难度的题型为：【2选择 + 8填空】
  const rawQuestions = getQuestions(level, 2, "select").concat(getQuestions(level, 8));

  // 获取用户输入
  const response: PromptRes = await prompt(questionGenerator(rawQuestions));
  
  // 错题统计
  const result = judge(rawQuestions, response);

  // 打印成绩单
  terminal.cyan(`本次成绩: ${result.solved}/${result.total}\n`);
  if (result.mistakes.length > 0) {
    const analysis = result.mistakes
      .map((mistake: MistakeInfo) => `第${mistake.index+1}题：${mistake.title}\n正确答案为：${mistake.answer}\n你的答案为：${mistake.wrong}\n`)
      .join("\n");

    terminal(`错题解析：\n`);
    terminal(analysis);
  } else {
    terminal.cyan(`全对啦 👍👍👍 请继续努力！\n`);
  }

  // 存储统计数据
  saveResult(username, result);

  terminal.processExit(0)
}

/**
 * 在自动难度模式下系统在用户连续答对或答错指定数量的题目后自动增加难度或降低难度。
 * @param username 用户名，用于统计答题情况
 */
export async function autoMode(username: string) {
  terminal.clear();

  const results = [];
  // 自动难度模式下每轮题型为【1选择 + 4填空】
  for (let level = 0; level <= 2; level++) {
    const rawQuestions = getQuestions(level, 1, "select").concat(getQuestions(level, 4));
    const response: PromptRes = await prompt(questionGenerator(rawQuestions));
  
    const tempResult = judge(rawQuestions, response);
    // 错题统计
    results.push(tempResult);
  
    // 没有全对就会闯关失败
    if (tempResult.total !== tempResult.solved) {
      break;
    }

    terminal.brightYellow("恭喜你通过本轮!");
    if (level < 2) {
      terminal.brightYellow("接下来难度将上升！\n");
    }
  }

  // 打印成绩单
  terminal.cyan("\n闯关结束！\n")
  // 如果全对
  if (results.length === 3 && results[2].total === results[2].solved) {
    terminal.cyan(`恭喜你完美通过 👍👍👍太棒啦！\n`);
  } else {
    const lastResult = results[results.length - 1];
    terminal.brightRed(`很遗憾，你答错了${lastResult.total-lastResult.solved}题，\n`);
    const analysis = lastResult.mistakes
      .map((mistake: MistakeInfo) => `第${mistake.index+1}题：${mistake.title}\n正确答案为：${mistake.answer}\n你的答案为：${mistake.wrong}\n`)
      .join("\n");

    terminal(`错题解析：\n`);
    terminal(analysis);
  }

  // 存储统计数据
  results.forEach((result) => saveResult(username, result));

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
        regularMode(username, response.selectedIndex).catch((e) => {
          console.log(e);
          terminal.processExit(-1);
        });
      });
    } else {
    // 闯关模式
      autoMode(username).catch((e) => {
        console.log(e);
        terminal.processExit(-1);
      });
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