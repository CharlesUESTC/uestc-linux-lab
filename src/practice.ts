import { prompt } from "enquirer";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { questionGenerator } from "./lib/enquirer";
import { db } from "./lib/lowdb";

export const DIFFICULTY_LEVELS = [
  "easy",
  "medium",
  "hard"
]

export async function start(level: number) {
  terminal.clear();

  // 对查询到的结果进行一次深拷贝，防止被 enquirer.prompt 更改后写入DB
  const rawQuestions = JSON.parse(JSON.stringify(db.get("questions")
    // @ts-ignore
    .filter({ difficulty: DIFFICULTY_LEVELS[level]})
    .value()));

  const response = await prompt(questionGenerator(rawQuestions));
  
  console.log(response);
  // db.set("progress.overview", response).write();
}

export function selectDifficultyLevels() {
  terminal.clear();

  terminal.cyan("请选择难度：\n");
  terminal.singleColumnMenu(DIFFICULTY_LEVELS, (error: any, response: SingleColumnMenuResponse) => {
    start(response.selectedIndex);
  });
}
