import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { BuildOptions, ServerOptions } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: { server: ServerOptions; build: BuildOptions } = {
    server: {
        port: 3001,
        host: '0.0.0.0',
        open: true,
        proxy: { // 代理配置
            '/api': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, '/mock'),
            },
        },
        warmup: {
            clientFiles: ['./src/main.ts', './src/views/**/*.vue'],
        },
    },
    build: {
        target: 'es2018',
        cssTarget: 'chrome79',
        minify: true,
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000,
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
            external: /static\/.*?\.[cm]*js/,
            output: {
                // manualChunks(id: string) {
                //     // 处理css分块
                //     if (id.includes('.css') || id.includes('.scss') || id.includes('.sass') || id.includes('.less')) {
                //         if (id.includes('node_modules'))
                //             return 'vendor'
                //         return 'main'
                //     }
                //     // 处理js分块
                //     if (id.includes('.js') || id.includes('.mjs') || id.includes('.cjs')) {
                //         if (id.includes('node_modules'))
                //             return 'vendor'
                //         return 'main'
                //     }
                // },
            },
        },
    },
}

export default config
