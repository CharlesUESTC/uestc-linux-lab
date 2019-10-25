import inquirer from "inquirer";
import Choices from "inquirer/lib/objects/choices";

interface IQuestion {
  id: string;
  type: 'sa' | 'qa';
  title: string;
  choices?: string[];
  answer: string;
}

const TYPE_MAP: Record<'sa' | 'qa', 'list' | 'editor'> = {
  sa: 'list',
  qa: 'editor'
};

export const validInput = (value: string) => value.length > 0;

/** 读取 json 格式的题库生成 inquirer.js 的 question 数组 */
export function questionGenerator(rawQuestion: Object[]) {
  const inquirerQuestions = rawQuestion.map((v: IQuestion): inquirer.EditorQuestion | inquirer.ListQuestion => {
    if (v.type === "sa") {
      return {
        name: v.id,
        type: TYPE_MAP[v.type],
        message: v.title,
        choices: v.choices,
        validate: (value: string) => {
          if (value.length) {
            return true;
          }
        }
      } 
    } else {
      return {
        name: v.id,
        type: TYPE_MAP[v.type],
        message: v.title,
        validate: (value: string) => {
          if (validInput(value)) {
            return true;
          } else {
            return "请输入有效命令";
          }
        }
      } 
    }
    
  })

  return inquirerQuestions;
}

export function askQuestion() {
  const questions = [
    {
      name: '1',
      type: 'list',
      message: '进入上一次工作路径的命令是？',
      choices: [
        'A. cd /',
        'B. cd ~',
        'C. cd -',
        'D. cd !$'
      ],
      validate: (value: any) => {
        if (value.length) {
          return true;
        }
      }
    }
  ];
  return inquirer.prompt(questions);
}