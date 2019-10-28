import { prompt } from "enquirer";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { questionGenerator } from "./lib/enquirer";
import { db } from "./lib/lowdb";

export const DIFFICULTY_LEVELS = [
  'easy',
  'medium',
  'hard'
]

export async function start(level: number) {
  terminal.clear();

  const rawQuestions = db.get(DIFFICULTY_LEVELS[level]).value();

  const response = await prompt(questionGenerator(rawQuestions));
  
  return response;
}

export function selectDifficultyLevels() {
  terminal.clear();

  terminal.cyan('请选择难度：\n');
  terminal.singleColumnMenu(DIFFICULTY_LEVELS, (error: any, response: SingleColumnMenuResponse) => {
    start(response.selectedIndex);
  });
}
