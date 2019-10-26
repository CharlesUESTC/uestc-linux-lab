import inquirer from "inquirer";

import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { questionGenerator } from "./lib/inquirer";
import { db } from "./lib/lowdb";

export const DIFFICULTY_LEVELS = [
  'easy',
  'medium',
  'hard'
]

export function start(level: number) {
  terminal.clear();

  const rawQuestions = db.get(DIFFICULTY_LEVELS[level]).value();
  return inquirer.prompt(questionGenerator(rawQuestions));
}

export function selectDifficultyLevels() {
  terminal.clear();

  terminal.cyan('请选择难度：\n');
  terminal.singleColumnMenu(DIFFICULTY_LEVELS, (error: any, response: SingleColumnMenuResponse) => {
    start(response.selectedIndex);
  });
}
