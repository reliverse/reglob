# @reliverse/reglob

> @reliverse/reglob is a high-performance file matcher for modern js/ts projects. crafted for devs who care about precision, speed, and zero-bloat dx. simple but smart, fast and focused, minimal, no fluff, predictable in every case.

[sponsor](https://github.com/sponsors/blefnk) — [discord](https://discord.gg/reliverse) — [npm](https://npmjs.com/package/@reliverse/reglob) — [github](https://github.com/reliverse/reglob)

## Installation

```bash
bun add @reliverse/reglob
# bun • pnpm • yarn • npm
```

## Features

- 🪶 Tiny dep graph, blazing speed
- 🧪 Async, sync, and stream modes
- 🌀 Modern API, sync/async/streaming
- ⚙️ Gitignore + custom ignore file support
- 🧠 Smart object mode (`dirent`, `stats`, etc)
- 🧠 Helpers to escape, transform, and validate patterns
- 🌿 Lean and sharp — just what you need to build great tools
- 🔍 Advanced globbing: `**/*.ts`, `!**/*.d.ts`, `{js,ts}` and more
- 📚 Supports `.gitignore`, `.prettierignore`, `.eslintignore`, etc
- 🌪️ Handles depth, dotfiles, symlinks, ignore files, all with grace

## Basic Usage

```ts
import { glob, globSync } from "@reliverse/reglob";

await glob(["src/**/*.ts", "!**/*.test.ts"]);
globSync(["src/**/*.ts"], {
  ignore: ["**/*.d.ts"],
  absolute: true,
});
```

**Advanced usage:**

```ts
import { glob, globSync } from "~/mod.js";
import { escapePath, isDynamicPattern } from "~/utils.js";

async function main() {
  // Async usage: find all .ts files in src, excluding test files
  const asyncFiles = await glob(["src/**/*.ts", "!**/*.test.ts"]);
  console.log("Async glob results:", asyncFiles);

  // Sync usage: find all .ts files in src, absolute paths, ignoring .d.ts
  const syncFiles = globSync(["src/**/*.ts"], {
    ignore: ["**/*.d.ts"],
    absolute: true,
  });
  console.log("Sync glob results:", syncFiles);

  // Dotfiles: match dotfiles in src
  const dotFiles = await glob(["src/**/.*"], { dot: true });
  console.log("Dotfiles in src:", dotFiles);

  // Deep: limit recursion depth
  const deepFiles = await glob(["src/**/*"], { deep: 1 });
  console.log("Deep=1 results:", deepFiles);

  // Only directories
  const onlyDirs = await glob(["src/*"], { onlyDirectories: true });
  console.log("Only directories in src:", onlyDirs);

  // --- Helpers ---
  const pathToEscape = "src/[special]/file.ts";
  console.log("escapePath:", escapePath(pathToEscape));
  console.log(
    "isDynamicPattern('src/**/*.ts'):",
    isDynamicPattern("src/**/*.ts"),
  );
}

main().catch((err) => {
  console.error("Error in example:", err);
  process.exit(1);
});
```

## API

```ts
glob(patterns, options?)
globSync(patterns, options?)
globStream(patterns, options?) // async iterable
```

### Options

| Option               | Type      | Default        | Description                                           |
|----------------------|-----------|----------------|-------------------------------------------------------|
| `cwd`               | `string`  | `process.cwd()`| Base directory to search from                         |
| `ignore`            | `string[]`| `[]`            | Additional ignore patterns                            |
| `ignoreFiles`       | `string[]`| `[".gitignore"]`| Paths to `.gitignore`-like files                      |
| `absolute`          | `boolean` | `false`         | Return absolute paths                                 |
| `dot`               | `boolean` | `false`         | Match dotfiles (`.env`, `.git`, etc.)                 |
| `deep`              | `number`  | `Infinity`      | Max depth for recursive traversal                     |
| `onlyFiles`         | `boolean` | `true`          | Return only files                                     |
| `onlyDirectories`   | `boolean` | `false`         | Return only directories                               |
| `caseSensitive`     | `boolean` | `true`          | Case-sensitive matching                               |
| `expandDirectories` | `boolean` | `true`          | Automatically expand dir → dir/**/*                   |
| `objectMode`        | `boolean` | `false`         | Return full file info (name, path, dirent, stats)     |
| `stats`             | `boolean` | `false`         | Include `fs.stat` info in object mode                 |
| `baseNameMatch`     | `boolean` | `false`         | Match filenames regardless of path                    |
| `debug`             | `boolean` | `false`         | Log internal ops                                      |

## Examples

### Glob + ignore

```ts
await glob(["**/*.ts", "!**/*.test.ts"]);
```

### Sync Glob with Options

Demonstrates using `globSync` with `ignore` and `absolute` path options:

```ts
import { globSync } from "@reliverse/reglob";

const syncFiles = globSync(["src/**/*.ts"], {
  ignore: ["**/*.d.ts"], // Ignore TypeScript definition files
  absolute: true,       // Return absolute paths
});
console.log("Sync glob results:", syncFiles);
```

### Matching Dotfiles

Find dotfiles (e.g., `.env`, `.gitattributes`) within a directory:

```ts
import { glob } from "@reliverse/reglob";

const dotFiles = await glob(["src/**/.*"], { dot: true });
console.log("Dotfiles in src:", dotFiles);
```

### Controlling Depth

Limit the recursion depth during directory traversal:

```ts
import { glob } from "@reliverse/reglob";

// Find items only in the immediate src directory (depth 0 relative to src/*)
// or effectively 1 level deep from `src` if pattern implies directory content
const deepFiles = await glob(["src/*"], { deep: 0 }); // Corresponds to files/dirs directly in src
// To find files/dirs up to 1 level inside subdirectories of src:
// const deepFiles = await glob(["src/**/*"], { deep: 1 });
console.log("Deep=0 (or 1 from src) results:", deepFiles);
```

### Finding Only Directories

Retrieve only directories matching the pattern:

```ts
import { glob } from "@reliverse/reglob";

const onlyDirs = await glob(["src/*"], { onlyDirectories: true });
console.log("Only directories in src:", onlyDirs);
```

### Stream results

```ts
for await (const file of globStream("**/*.json")) {
  console.log(file);
}
```

### Object mode

Get more than just strings:

```ts
globSync("**/*", { objectMode: true });

[
  {
    name: "index.ts",
    path: "src/index.ts",
    dirent: <fs.Dirent>
  }
]
```

### Custom ignore files

```ts
await glob("**/*.ts", {
  ignoreFiles: [".gitignore", ".cursorignore"] // all ts files mentioned there will be ignored
});
```

## Brace Expansion & Extglobs

Just like Bash.

```ts
glob("file-{a,b,c}.ts"); // → file-a.ts, file-b.ts, file-c.ts
glob("*.@(js|ts)");      // → file.js, file.ts
```

## Helpers

Need full control? Here you go:

```ts
import {
  escapePath,
  convertPathToPattern,
  isDynamicPattern,
  isGitIgnored,
  isIgnoredByIgnoreFiles,
  generateTasks,
} from "@reliverse/reglob";

// Example usage:
const specialPath = "src/[my-folder]/file.ts";
const escaped = escapePath(specialPath);
// escaped would be "src/\[my-folder\]/file.ts" or similar, ready for regex or glob
console.log(`Original: ${specialPath}, Escaped: ${escaped}`);

const pattern = "src/**/*.ts";
const isDynamic = isDynamicPattern(pattern);
console.log(`Is '${pattern}' a dynamic pattern? ${isDynamic}`); // -> true
```

- Use them to clean paths, check for dynamic patterns, or detect if a file is ignored by `.gitignore` or others.
- Use `generateTasks()` to analyze and debug matching logic.  

## Playground 🔜

```bash
git clone https://github.com/reliverse/reglob
cd reglob
bun i
bun dev # real-world usage patterns
```

## Related Projects

- [`@reliverse/relifso`](https://github.com/reliverse/relifso) – Wrapper around `node:fs` and `fs-extra`
- [`@reliverse/relipath`](https://github.com/reliverse/relipath) – Wrapper around `node:path` and `pathe`
- [`@reliverse/rempts`](https://github.com/reliverse/rempts) – Next-gen prompt engine for modern CLIs
- [`@reliverse/cli`](https://github.com/reliverse/cli) – Scaffold projects, chat with AI, and more

## Shoutouts

**reglob** wouldn't exist without its really legendary predecessors:

[node:fs](https://nodejs.org/api/fs.html)/[node:path](https://nodejs.org/api/path.html) > [fast-glob](https://github.com/mrmlnc/fast-glob) > [globby](https://github.com/sindresorhus/globby) > [tinyglobby](https://github.com/SuperchupuDev/tinyglobby) > reglob

## License

💖 MIT © 2025 [blefnk (Nazar Kornienko)](https://github.com/blefnk)
