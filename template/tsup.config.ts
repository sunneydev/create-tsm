import { defineConfig, type Options } from "tsup";

export default defineConfig((flags) => {
  const buildOptions: Options = {
    minify: true,
    clean: true,
    format: ["cjs", "esm"],
    dts: true,
  };

  const devOptions: Options = {
    sourcemap: true,
    format: ["esm"],
    onSuccess: "node ./dist/index.js",
  };

  const options = flags.watch ? devOptions : buildOptions;

  return {
    entry: ["src/index.ts"],
    outDir: "dist",
    ...options,
  };
});
