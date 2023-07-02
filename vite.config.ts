import path from 'node:path'
import type { ConfigEnv, UserConfigExport } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros'
import { viteMockServe } from '@lincy/vite-plugin-mock'
import UnoCSS from 'unocss/vite'
import { warmup } from 'vite-plugin-warmup'

import Components from './vite.config.components'

function pathResolve(dir: string): any {
    return path.resolve(__dirname, '.', dir)
}

const alias: Record<string, string> = {
    '@': pathResolve('src'),
}

export default ({ command }: ConfigEnv): UserConfigExport => {
    return {
        base: './',
        resolve: {
            alias,
        },
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
                external: /\.\/assets.*/,
                output: {
                    manualChunks(id: string) {
                        if (id.includes('node_modules')) {
                            if (id.includes('echarts') || id.includes('zrender'))
                                return 'echarts'
                            return 'vendor'
                        }
                    },
                },
            },
        },
        plugins: [
            VueMacros.vite({
                plugins: {
                    vue: vuePlugin({
                        template: {
                            compilerOptions: {
                                isCustomElement: (tag: string) => ['def'].includes(tag),
                            },
                        },
                    }),
                    vueJsx: vueJsx(),
                },
            }),
            viteMockServe({
                mockPath: 'mock',
                enable: command === 'serve' || process.env.VITE_APP_ENV === 'test',
                logger: true,
            }),
            ...Components(),
            UnoCSS({}),
            warmup({
                // warm up the files and its imported JS modules recursively
                clientFiles: ['./src/main.ts', './src/views/**/*.vue'],
            }),
        ],
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === 'charset')
                                    atRule.remove()
                            },
                        },
                    },
                ],
            },
        },
    }
}
