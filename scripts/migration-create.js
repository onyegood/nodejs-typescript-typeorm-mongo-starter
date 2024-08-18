#! /usr/bin/env node
/* eslint-disable */
const { execSync } = require("child_process");
const { argv } = require("yargs");
// Parse the command-line arguments
const {
  _: [name],
  path,
} = argv;

// Construct the migration clip-path:
const migrationPath = `src/database/migrations/${name}`;

// Run the typeorm command
execSync(`typeorm migration:create ${migrationPath}`, { stdio: "inherit" });
