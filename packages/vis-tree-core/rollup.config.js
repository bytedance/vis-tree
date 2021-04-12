import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: {
    file: './lib/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [resolve(), typescript(), babel({ babelHelpers: 'bundled' })],
};
