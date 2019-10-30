import figlet from "figlet";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { selectDifficultyLevels } from "./practice";

const MENU = [
  "【开始答题】",
  "【查看统计】",
  "【关于】",
  "【退出】"
];

terminal.clear();

terminal
  .yellow(figlet.textSync("UESTC-Linux-Lab", { horizontalLayout: "full" }))

terminal.singleColumnMenu(MENU, (error: any, response: SingleColumnMenuResponse) => {
  switch (response.selectedIndex) {
    case 0:
      selectDifficultyLevels();
      break;
    case 1:
    case 2:
    case 3:
    default:
      process.exit();
  }
});
