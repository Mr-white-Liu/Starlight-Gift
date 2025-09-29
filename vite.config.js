import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 3000,
        open: true
    },
    // 动态设置 base 路径
    base: process.env.NODE_ENV === 'production' ? '/<repo-name>/' : '/',
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined,
            }
        }
    }
})
