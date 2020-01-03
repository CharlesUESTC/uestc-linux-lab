import { similarCommand } from "../src/lib/command";
import { expect } from "chai";

describe("bash command understand", () => {
  it("path extend", () => {
    expect(similarCommand("head -c 20 ./1.log", "head -c 20 1.log")).to.be.true;
  });
  it("options extend", () => {
    expect(similarCommand("tar -xvf test", "tar -x -v -f test")).to.be.true;
  });
  it("special case extend", () => {
    expect(similarCommand("tar -xvf test", "tar -x -v -f test")).to.be.true;
  });
});