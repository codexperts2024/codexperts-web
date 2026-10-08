import { defineConfig } from 'vitest/config'
import { transformWithOxc } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [{
    name: 'jsx-in-js',
    async transform(code, id) {
      if (/[/\\]src[/\\].*\.js$/.test(id)) {
        return transformWithOxc(code, id, { lang: 'jsx', jsx: { runtime: 'automatic' } })
      }
    },
  }],
  test: { environment: 'jsdom', include: ['tests/**/*.test.{js,jsx}'] },
})
