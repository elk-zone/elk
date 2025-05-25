import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import autoExternal from "rollup-plugin-auto-external";
import dts from "rollup-plugin-dts";

import packageJSON from "./package.json" assert { type: "json" };

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: "./src/index.ts",
    output: {
      file: packageJSON.exports["."].require,
      format: "commonjs",
    },
    plugins: [json(), typescript(), autoExternal()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: packageJSON.exports["."].import,
      format: "module",
    },
    plugins: [commonjs(), json(), typescript(), autoExternal()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: packageJSON.exports["."].types["require"],
      format: "commonjs",
    },
    plugins: [commonjs(), dts()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: packageJSON.exports["."].types["import"],
      format: "module",
    },
    plugins: [dts()],
  },
];
