import { expect } from "chai";
import { random } from "../src/lib/util";

describe("random", () => {
  it("should return [] if array is empty", () => {
    expect(random([], 1)).to.be.eql([]);
  });

  it("should return whole array if n > array.length", () => {
    const array = [1, 2, 3, 4, 5];
    expect(random(array, 1000)).to.be.eql(array);
  });

  it("should return null if n < 0 or invaild", () => {
    const array = [1, 2, 3, 4, 5];
    expect(random(array, -1)).to.be.null;
    expect(random(array, null)).to.be.null;
  });

  it("should return an array which length == n", () => {
    const array = [1, 2, 3, 4, 5];
    expect(random(array, 3).length).to.be.eql(3);
  });
});
