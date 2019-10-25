import { askQuestion } from "./lib/inquirer";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";

export const DIFFICULTY_LEVELS = [
  '简单',
  '中等',
  '困难'
]

export function start(level: number) {
  terminal.clear();

  // terminal.cyan('\n%s\n', DIFFICULTY_LEVELS[level]);
  askQuestion();
}

export function selectDifficultyLevels() {
  terminal.clear();

  terminal.cyan('请选择难度：\n');
  terminal.singleColumnMenu(DIFFICULTY_LEVELS, (error: any, response: SingleColumnMenuResponse) => {
    start(response.selectedIndex);
  });
}
