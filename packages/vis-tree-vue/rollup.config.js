import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import VuePlugin from "rollup-plugin-vue";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "./lib/index.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    VuePlugin(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
        },
      },
    }),
    commonjs(),
    postcss(),
  ],
  external: ["vue"],
};
