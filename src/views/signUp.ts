import { terminal } from "terminal-kit";
import { practiceView } from "./practice";
import { homeView } from "./home";

export async function signUpView() {
  terminal("请输入新用户名: ");

  const input = await terminal.inputField().promise;

  terminal.green("\n新用户 '%s' 创建成功\n" , input);
  terminal("是否使用该用户开始练习？[Y|n]\n");
  terminal.yesOrNo( { yes: [ 'y' , 'ENTER' ] , no: [ 'n' ] } , function( error , result ) {
    if (error) {
      console.log(error);
      terminal.processExit(-1);
    }
		if (result) {
			practiceView(input as unknown as string);
		}
		else {
      homeView();
		}
	})
}