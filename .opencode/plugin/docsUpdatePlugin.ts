import { existsSync, readFileSync } from "node:fs";
import { relative } from "node:path";
import type { Plugin } from "@opencode-ai/plugin";
import { watch } from "chokidar";
import ignore, { type Ignore } from "ignore";

const DEBOUNCE_MS = 1000 * 60 * 10; // 10 minutes

const loadGitignore = (cwd: string): Ignore => {
  const ig = ignore();
  const gitignorePath = `${cwd}/.gitignore`;

  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, "utf-8");
    ig.add(content);
  }

  return ig;
};

const docsUpdatePlugin: Plugin = async ({ client }) => {
  const cwd = process.cwd();
  const docsDir = `${cwd}/docs/`;
  const docsReadme = `${cwd}/docs/README.md`;
  const pendingFiles: Set<string> = new Set();
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  const gitignore = loadGitignore(cwd);

  const executeUpdate = async () => {
    const files = Array.from(pendingFiles);

    pendingFiles.clear();

    if (files.length === 0) return;

    const sessionTitle = `${new Date().toISOString().split("T")[0]} Docs Update Plugin`;

    await client.tui.showToast({
      body: {
        message: `Updating Docs in: "${sessionTitle}"`,
        variant: "info",
      },
    });

    const { data: sessions } = await client.session.list();
    let session = sessions?.find((session) => session.title === sessionTitle);

    if (!session) {
      const { data: newSession, error } = await client.session.create({
        body: { title: sessionTitle },
      });

      if (error || !newSession) return;

      session = newSession;
    }

    const fileList = files.join("\n- ");

    await client.session.prompt({
      path: { id: session.id },
      body: {
        parts: [
          {
            type: "text",
            text: `Documentation files were changed:
- ${fileList}

Your task: Update docs/README.md to represent the current project state.

Instructions:
1. Read all files in the docs/ folder (recursively)
2. Read all .md files outside the docs/ folder, except AGENTS.md and CLAUDE.md
3. Merge information from all files, but when information conflicts, the file with the newer timestamp takes priority
4. If any information is unclear, examine the actual codebase as the source of truth

Format requirements:
- Write as authoritative project documentation, NOT as a summary of documentation files
- Organize by topic/domain (Architecture, Features, Development, etc.), never by source file
- Use Wikipedia-style citations [1] linking to source files, with a References section at the end listing all sources
- State facts directly: "The server uses Hono" not "According to docs/architecture.md, the server uses Hono"
- Remove any content that no longer exists in the documentation or codebase
- Keep it concise - this is reference documentation, not a changelog

Do not include docs/README.md itself as a source.`,
          },
        ],
      },
    });
  };

  const handleFileChange = async (file: string) => {
    const isReadme = file === docsReadme;
    const isAgentFile =
      file === `${cwd}/AGENTS.md` || file === `${cwd}/CLAUDE.md`;

    // Skip if it's the README itself or an agent instructions file
    if (isReadme || isAgentFile) return;

    const isInDocsFolder = file.startsWith(docsDir);
    const isMarkdownFile = file.endsWith(".md");

    // Process if it's in docs folder OR if it's a markdown file outside docs
    if (!isInDocsFolder && !isMarkdownFile) return;

    // Add file to pending set and start timer if not already running
    pendingFiles.add(file);

    if (!debounceTimer) {
      debounceTimer = setTimeout(() => {
        debounceTimer = undefined;
        executeUpdate();
      }, DEBOUNCE_MS);
    }
  };

  const watcher = watch(cwd, {
    ignored: (path) => {
      const rel = relative(cwd, path);
      if (!rel) return false; // Don't ignore root
      return gitignore.ignores(rel);
    },
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("add", handleFileChange);
  watcher.on("change", handleFileChange);
  watcher.on("unlink", handleFileChange);

  // Return empty hooks - we handle everything via chokidar
  return {};
};

export { docsUpdatePlugin };
