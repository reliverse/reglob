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
