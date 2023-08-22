import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
<%_ if (data.ui.indexOf('element-plus') !== -1) { _%>
import AutoImport from 'unplugin-auto-import/vite'
<%_ } _%>
<%_ const imports = data.ui.map(_ => _ === 'element-plus' ? 'ElementPlusResolver': 'VantResolver').join(',') _%>
<%_ if (data.ui.length > 0) { _%>
import Components from 'unplugin-vue-components/vite'
import { <%= imports %> } from 'unplugin-vue-components/resolvers';
<%_ } _%>
<%
const resolvers = data.ui.map(_ => (_ === 'element-plus' ? 'ElementPlusResolver()': 'VantResolver()')).join(',')
%>

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    <%_ if (data.ui.indexOf('element-plus') !== -1) { _%>
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    <%_ } _%>
    <%_ if (data.ui.length > 0) { _%>
    Components({
      resolvers: [<%=resolvers %>]
    })
    <%_ } _%>
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
