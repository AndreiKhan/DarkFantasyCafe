import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import boundaries from 'eslint-plugin-boundaries'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  files: ['src/**/*.{ts,tsx}'],
  plugins: { boundaries },
  settings: {
    'boundaries/elements': [
      { type: 'app',      pattern: 'src/app/*' },
      { type: 'pages',    pattern: 'src/pages/*' },
      { type: 'widgets',  pattern: 'src/widgets/*' },
      { type: 'features', pattern: 'src/features/*' },
      { type: 'entities', pattern: 'src/entities/*' },
      { type: 'shared',   pattern: 'src/shared/*' },
    ],
  },
  rules: {
    'boundaries/element-types': ['error', {
      default: 'disallow',
      rules: [
        { from: 'app',      allow: ['pages','widgets','features','entities','shared'] },
        { from: 'pages',    allow: ['widgets','features','entities','shared'] },
        { from: 'widgets',  allow: ['features','entities','shared'] },
        { from: 'features', allow: ['entities','shared'] },
        { from: 'entities', allow: ['shared'] },
        { from: 'shared',   allow: ['shared'] },
      ],
    }],
  },
})
