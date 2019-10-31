#!/usr/bin/env node

import figlet from "figlet";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { start } from "./practice";

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
    case 0: //【开始答题】
      start();
      break;
    case 1: //【查看统计】
    case 2: //【关于】
    case 3: //【退出】
    default:
      process.exit();
  }
});
