import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tegami, type TegamiPlugin } from "tegami";
import { runCli } from "tegami/cli";
import { github } from "tegami/plugins/github";

const runCommand = promisify(execFile);

function buildOnPublish(): TegamiPlugin {
  return {
    name: "build-on-publish",
    async willPublish({ pkg }) {
      await runCommand("pnpm", ["--filter", pkg.name, "build"], {
        cwd: this.cwd,
      });
    },
  };
}

export const paper = tegami({
  npm: {
    trustedPublish: {
      provider: "github",
      workflow: "release.yml",
    },
  },
  plugins: [
    github({
      repo: "fuma-nama/fuma",
      versionPr: {
        base: "main",
      },
    }),
    buildOnPublish(),
  ],
  ignore: ["fuma-nama"],
});

if (import.meta.main) await runCli(paper);
