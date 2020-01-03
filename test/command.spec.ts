import { similarCommand } from "../src/lib/command";
import { expect } from "chai";

describe("bash command understand", () => {
  it("should similar", () => {
    expect(similarCommand("head -c 20 ./1.log", "head -c 20 1.log")).to.be.true;
  });
});