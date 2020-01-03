declare module "bash-parser" {
  export interface Suffix {
    type: string;
    text: string;
  }
  export default function parse(command: string): any;
}