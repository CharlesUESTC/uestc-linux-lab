import { terminal } from "terminal-kit";

export function aboutView() {
  terminal.clear();

  console.log("UESTC-综合课程设计III-基于UNIX/Linux的自学系统");

  terminal.processExit(0);
}