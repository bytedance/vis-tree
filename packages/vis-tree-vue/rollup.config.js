import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import VuePlugin from "rollup-plugin-vue";

export default {
  input: "./src/index.vue",
  output: [
    {
      file: "./lib/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    typescript(),
    VuePlugin(),
    babel({ babelHelpers: "bundled" }),
    commonjs(),
    postcss(),
  ],
  external: ["vue"],
};
