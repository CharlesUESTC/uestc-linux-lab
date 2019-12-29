import { terminal } from "terminal-kit";
import { practiceView } from "./practice";
import { homeView } from "./home";
import { db } from "../lib/lowdb";

export async function signUpView() {
  terminal("请输入新用户名: ");

  // 此处 input 的类型应该为 string 而不是 boolean
  const input = (await terminal.inputField().promise) as unknown as string;

  db.set(`profiles.${input}`, {
    solved: 0,
    correctRate: 0,
    details: {
      Filesystem: 0,
      Processes: 0,
      Network: 0,
      Misc: 0,
      TextProcessing: 0,
      System: 0,
      Shell: 0,
      Others: 0
    }
  }).write();

  terminal.green("\n新用户 '%s' 创建成功\n" , input);

  terminal("是否使用该用户开始练习？[Y|n]\n");
  terminal.yesOrNo( { yes: [ 'y' , 'ENTER' ] , no: [ 'n' ] } , function( error , result ) {
    if (error) {
      console.log(error);
      terminal.processExit(-1);
    }
		if (result) {
			practiceView(input);
		}
		else {
      homeView();
		}
	})
}