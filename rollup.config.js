import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const commonPlugins = (external = []) => ({
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types'
    })
  ],
  external
});

export default [
  // Main bundle (everything: core + react)
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.js', format: 'cjs', sourcemap: true },
      { file: 'dist/index.mjs', format: 'esm', sourcemap: true }
    ],
    ...commonPlugins(['react', 'react-dom'])
  },
  // Core bundle (utils + types, no React)
  {
    input: 'src/core.ts',
    output: [
      { file: 'dist/core.js', format: 'cjs', sourcemap: true },
      { file: 'dist/core.mjs', format: 'esm', sourcemap: true }
    ],
    ...commonPlugins([])
  },
  // React bundle (hooks only)
  {
    input: 'src/react.ts',
    output: [
      { file: 'dist/react.js', format: 'cjs', sourcemap: true },
      { file: 'dist/react.mjs', format: 'esm', sourcemap: true }
    ],
    ...commonPlugins(['react', 'react-dom'])
  },
  // Server bundle (alias for core)
  {
    input: 'src/server.ts',
    output: [
      { file: 'dist/server.js', format: 'cjs', sourcemap: true },
      { file: 'dist/server.mjs', format: 'esm', sourcemap: true }
    ],
    ...commonPlugins([])
  },
  // Type definitions
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()]
  },
  {
    input: 'dist/types/core.d.ts',
    output: [{ file: 'dist/core.d.ts', format: 'esm' }],
    plugins: [dts()]
  },
  {
    input: 'dist/types/react.d.ts',
    output: [{ file: 'dist/react.d.ts', format: 'esm' }],
    plugins: [dts()]
  },
  {
    input: 'dist/types/server.d.ts',
    output: [{ file: 'dist/server.d.ts', format: 'esm' }],
    plugins: [dts()]
  }
];
