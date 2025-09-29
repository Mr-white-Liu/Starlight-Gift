import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 3000,
        open: true
    },
    // 动态设置 base 路径
    base: '/Starlight-Gift/',
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined,
            }
        }
    }
})
