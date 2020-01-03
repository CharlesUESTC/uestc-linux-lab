import { isNumber } from "util";
import parse from "bash-parser";
import equal from "fast-deep-equal";

/** 从 数组中随机选取 n 个元素 */
export function random(arr: any[], n: number) {
  if (!arr) {
    return [];
  }

  const result = [];
  let m = arr.length;
  if (n > arr.length) {
    return arr;
  }

  if (!isNumber(n) || n < 0) {
    return [];
  }

  let t;
  let i;

  while (m && result.length < n) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
    result.push(arr[m]);
  }
  return result;
}

export function similarCommand(cmd1: string, cmd2: string) {
  return equal(parse(cmd1), parse(cmd2));
}