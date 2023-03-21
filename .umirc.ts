import { defineConfig } from 'dumi';

export default defineConfig({
    exportStatic: {}, // 将所有路由输出为 HTML 目录结构，以免刷新页面时 404
    title: '全村的希望',
    favicon: '/images/logo.JPG',
    logo: '/images/logo.JPG',
    outputPath: 'docs-dist',
    mode: 'site',
});
