import figlet from "figlet";
import { terminal } from "terminal-kit";
import { start } from "./practice";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";

const MENU = [
  '【开始答题】',
  '【查看统计】',
  '【关于】',
  '【退出】'
];

terminal.clear();

terminal
  .yellow(figlet.textSync('Linux-Lab', { horizontalLayout: 'full' }))
  .cyan('\nWelcome to Linux-Lab!\n')

terminal.singleColumnMenu(MENU, (error: any, response: SingleColumnMenuResponse) => {
  switch (response.selectedIndex) {
    case 0:
      start();
      break;
    case 1:
    case 2:
    case 3:
    default:
      process.exit();
  }
});