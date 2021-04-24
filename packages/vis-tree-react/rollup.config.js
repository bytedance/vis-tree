import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  input: './src/index.tsx',
  output: [
    {
      file: './lib/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    typescript(),
    commonjs({ extensions: ['.js', '.ts'] }),
    postcss(),
  ],
  external: ['react', 'react-dom'],
};
