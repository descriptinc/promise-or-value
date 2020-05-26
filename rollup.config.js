// rollup.config.js
import pkg from './package.json';
import typescript from '@wessberg/rollup-plugin-ts';

export default {
  input: 'src/index.ts',
  plugins: [typescript({ exclude: '**/*.test.ts' })],
  output: [
    {
      file: pkg.main,
      sourcemap: true,
      sourcemapExcludeSources: true,
      format: 'cjs',
    },
    {
      file: pkg.module,
      sourcemap: true,
      sourcemapExcludeSources: true,
      format: 'esm',
    },
  ],
};
