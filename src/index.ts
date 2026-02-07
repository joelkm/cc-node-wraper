#!/usr/bin/env node

import { spawn } from "child_process";
import { basename, join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

interface CommandConfig {
  settings: string;
  args?: string[];
}

function loadCommands(): Record<string, CommandConfig> {
  const commandsPath = join(projectRoot, "commands.json");
  return JSON.parse(readFileSync(commandsPath, "utf8"));
}

function main(): void {
  const scriptPath = process.argv[1];
  const commandName = basename(scriptPath).replace(/\.(js|ts)$/, "");

  const commands = loadCommands();
  const config = commands[commandName];

  if (!config) {
    console.error(`Unknown command: ${commandName}`);
    console.error(`Available: ${Object.keys(commands).join(", ")}`);
    process.exit(1);
  }

  const additionalArgs = process.argv.slice(2);
  const args = [
    // "--settings", config.settings,     Might deprecate this, settiung included in command definiton json file
    ...(config.args ?? []),
    ...additionalArgs,
  ];

  const child = spawn("claude", args, {
    stdio: "inherit",
    shell: true,
  });

  child.on("error", (err) => {
    console.error("Failed to start Claude Code:", err.message);
    process.exit(1);
  });

  child.on("close", (code) => {
    process.exit(code ?? 0);
  });
}

main();
