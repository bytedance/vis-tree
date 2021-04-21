import jsx from "acorn-jsx";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import VuePlugin from "rollup-plugin-vue";

export default {
  input: "./src/index.tsx",
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
    babel({ babelHelpers: "bundled" }),
    commonjs(),
    postcss(),
    VuePlugin(),
  ],
  acornInjectPlugins: [jsx()],
  external: ["vue"],
};
