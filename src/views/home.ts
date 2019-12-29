import figlet from "figlet";
import { terminal } from "terminal-kit";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { aboutView } from "./about";
import { signUpView } from "./signUp";
import { logInView } from "./login";

const SIGNUP_MENU = [
  "                      登录                      ",
  "                      注册                      ",
  "                      关于                      ",
  "                      退出                      "
];

export function homeView() {
  terminal.clear();
  
  /** 用 figlet 打出 title */
  terminal.yellow(figlet.textSync("Linux-Lab", { horizontalLayout: "default" }))

  /** 打印开始菜单 */
  terminal.singleColumnMenu(SIGNUP_MENU, (error: any, response: SingleColumnMenuResponse) => {
    if (error) {
      console.log(error);
      terminal.processExit(-1);
    }
    switch (response.selectedIndex) {
      case 0: //【注册】
        signUpView();
        break;
      case 1: //【登录】
        logInView();
        break;
      case 2: //【关于】
        aboutView();
      case 3: //【退出】
      default:
        terminal.processExit(0);
    }
  });
}
