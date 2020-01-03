import { expect } from "chai";
import { questionGenerator } from "../src/lib/enquirer";

describe("questionGenerator", () => {
  it("should output [] if input []", () => {
    const input: Record<string, any>[] = [];
    const output = questionGenerator(input);
    expect(output).to.be.eql([]);
  });

  it("should be error type if input is not an invalid question object array", () => {
    const input: Record<string, any>[] = [{"a": 1}];
    const output = questionGenerator(input);
    expect(output[0].type).to.be.equal("error");
  });

  it("should generate valid Q&A", () => {
    const input: Record<string, any>[] = [{
      "title": "输入一个命令，把上个命令的参数作为cd参数使用",
      "answer": "cd !$"
    }];
    const output = questionGenerator(input);
    expect(output[0].type).to.be.equal("input");
    expect(output[0].message).to.be.eql(`1.${input[0].title}`);
  });

  it("should generate valid select question", () => {
    const input: Record<string, any>[] = [{
      "title": "下列命令中，列出当前目录中所有以't'开头的目录的详细内容的命令是？",
      "choices": [
        "ls -l t*",
        "ls -r t?",
        "ls -r t*",
        "ls -l t?"
      ],
      "answer": "ls -l t*"
    }];
    const output = questionGenerator(input);
    expect(output[0].type).to.be.equal("select");
    expect(output[0].message).to.be.eql(`1.${input[0].title}`);
    expect(output[0].choices).to.be.eql(input[0].choices);
  });
});