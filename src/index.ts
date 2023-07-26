#!/usr/bin/env node
import path from "node:path";
import fs from "node:fs";

async function main() {
  const projectName = process.argv[process.argv.length - 1];

  if (projectName.endsWith("index.js")) {
    console.error("Please specify a project name.");
    process.exit(1);
  }

  try {
    await fs.promises.access(projectName);
    console.error(`A directory named ${projectName} already exists.`);
    process.exit(1);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  try {
    const templatePath = path.join(__dirname, "../template");
    await fs.promises.mkdir(projectName);
    await fs.promises.mkdir(path.join(projectName, "src"));
    await fs.promises.writeFile(
      path.join(projectName, "src", "index.ts"),
      "console.log('Hello World!');"
    );

    const filenames = await fs.promises.readdir(templatePath);

    for (const name of filenames) {
      const filePath = path.join(templatePath, name);
      const content = await fs.promises.readFile(filePath, "utf8");
      await fs.promises.writeFile(path.join(projectName, name), content);
    }

    await fs.promises.writeFile(
      path.join(projectName, ".gitignore"),
      ["node_modules", "dist", ".env", ".DS_Store"].join("\n") + "\n"
    );

    console.log(`Created ${projectName}!`);
  } catch (err) {
    console.error(err);
  }
}

main();
