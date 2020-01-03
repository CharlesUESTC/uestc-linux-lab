declare module "bash-parser" {
  function parse(command: string): any;
  export = parse;
}