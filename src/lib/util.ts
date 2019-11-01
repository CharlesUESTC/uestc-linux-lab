/** 从 数组中随机选取 n 个元素 */
export function random(arr: any[], n: number) {
  const result = [];
  let m = arr.length;
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