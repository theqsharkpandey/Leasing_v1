const { spawn } = require("node:child_process");

const [, , prefix, script] = process.argv;

if (!prefix || !script) {
  console.error("Usage: node scripts/run-npm.cjs <prefix> <script>");
  process.exit(1);
}

const npmExecPath = process.env.npm_execpath;
if (!npmExecPath) {
  console.error("Could not resolve npm executable (npm_execpath is not set).");
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [npmExecPath, "run", script, "--prefix", prefix],
  {
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
