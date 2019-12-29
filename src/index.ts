#!/usr/bin/env node

import { terminal } from "terminal-kit";
import { homeView } from "./views/home";

terminal.clear();

/** 当用户按下 ctrl+c 时退出*/
terminal.on('key', (key: string) => {
  if (key === 'CTRL_C') {
    terminal.processExit(0);
  }
});

homeView();