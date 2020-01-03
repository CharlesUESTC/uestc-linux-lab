
import parse, { Suffix } from "bash-parser";
import equal from "fast-deep-equal";
import { mapValues } from "lodash";

function expandPath(cmd: any) {
  mapValues(cmd, (value, key, object) => {
    if (key === "suffix") {
      return value.map((suffix: Suffix) => {
        suffix.text = suffix.text.replace(/^.\//, "")
      });
    }

    return value;
  })
}

export function similarCommand(cmd1: string, cmd2: string) {
  return equal(
    expandPath(parse(cmd1)),
    expandPath(parse(cmd2))
  );
}