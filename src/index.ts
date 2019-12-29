#!/usr/bin/env node

import figlet from "figlet";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { practiceView } from "./views/practice";
import { dataView } from "./views/data";
import { aboutView } from "./views/about";

const MENU = [
  "                    开始答题                    ",
  "                    查看统计                    ",
  "                      关于                      ",
  "                      退出                      "
];

terminal.clear();

/** 用 figlet 打出 title */
terminal
  .yellow(figlet.textSync("Linux-Lab", { horizontalLayout: "default" }))

/** 当用户按下 ctrl+c 时退出*/
terminal.on('key', (key: string) => {
  if (key === 'CTRL_C') {
    terminal.processExit(0);
  }
});

/** 打印开始菜单 */
terminal.singleColumnMenu(MENU, (error: any, response: SingleColumnMenuResponse) => {
  if (error) {
    console.log(error);
    terminal.processExit(-1);
  }
  switch (response.selectedIndex) {
    case 0: //【开始答题】
      practiceView();
      break;
    case 1: //【查看统计】
      dataView();
      break;
    case 2: //【关于】
      aboutView();
    case 3: //【退出】
    default:
      terminal.processExit(0);
  }
});
