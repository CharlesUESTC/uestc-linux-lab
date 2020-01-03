import { terminal } from "terminal-kit";
import { db } from "../lib/lowdb";
import { UserProfile } from "../types/db";

export function dataView(username: string) {
  terminal.clear();
  
  const profile: UserProfile = db.get(`profiles.${username}`).value();

  terminal.cyan(`${username} 大侠闯荡江湖至今已————\n`);
  terminal(`解决了 ${profile.solved} 道题；\n`);
  terminal(`练习了 ${profile.times} 次；\n`);
  terminal(`准确率为 ${profile.correctRate}%\n。`);
  terminal.processExit(0);
}