const { spawn } = require("node:child_process");
const readline = require("node:readline");

const npmExecPath = process.env.npm_execpath;

if (!npmExecPath) {
  console.error("Could not resolve npm executable (npm_execpath is not set).");
  process.exit(1);
}

function startService(name, color, prefix) {
  const child = spawn(
    process.execPath,
    [npmExecPath, "run", "dev", "--prefix", prefix],
    {
      env: process.env,
      stdio: ["inherit", "pipe", "pipe"],
    },
  );

  const logLine = (line, isError = false) => {
    const colorCode = color;
    const reset = "\x1b[0m";
    const stream = isError ? process.stderr : process.stdout;
    stream.write(`${colorCode}[${name}]${reset} ${line}\n`);
  };

  readline
    .createInterface({ input: child.stdout, crlfDelay: Infinity })
    .on("line", (line) => logLine(line));

  readline
    .createInterface({ input: child.stderr, crlfDelay: Infinity })
    .on("line", (line) => logLine(line, true));

  return child;
}

const server = startService("SERVER", "\x1b[36m", "server");
const client = startService("CLIENT", "\x1b[32m", "client");

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of [server, client]) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(code), 250);
}

for (const [name, child] of [
  ["SERVER", server],
  ["CLIENT", client],
]) {
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;

    if (signal) {
      console.error(`${name} exited due to signal ${signal}`);
      shutdown(1);
      return;
    }

    if ((code ?? 0) !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code ?? 1);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
