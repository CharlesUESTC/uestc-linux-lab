import { terminal } from "terminal-kit";
import { db } from "../lib/lowdb";
import { SingleColumnMenuResponse } from "terminal-kit/Terminal";
import { practiceView } from "./practice";
import { signUpView } from "./signUp";

export function logInView() {
  terminal.clear();

  const profiles = db.get("profiles").value();
  const userList = Object.keys(profiles);
  if (!userList || userList.length === 0) {
    terminal.red("本机目前还没有用户哦！\n");
    signUpView();
  }
  // terminal.singleColumnMenu(userList, (error: any, response: SingleColumnMenuResponse) => {
  //   if (error) {
  //     console.log(error);
  //     terminal.processExit(-1);
  //   }
  //   practiceView(response.selectedText);
  // })
}