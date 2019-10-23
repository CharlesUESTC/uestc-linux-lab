import figlet from "figlet";
import { terminal } from "terminal-kit";

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

terminal.singleColumnMenu(MENU, (error: any, response: { selectedIndex: any; selectedText: any; x: any; y: any; }) => {
  terminal('\n').eraseLineAfter.green(
    "#%s selected: %s (%s,%s)\n",
    response.selectedIndex,
    response.selectedText,
    response.x,
    response.y
  );
  process.exit();
});