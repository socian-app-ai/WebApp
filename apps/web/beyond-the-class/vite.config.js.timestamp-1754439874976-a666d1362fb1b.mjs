// vite.config.js
import { defineConfig } from "file:///D:/Projects/Final%20Year%20Project/beyond-the-class/apps/web/beyond-the-class/node_modules/.pnpm/vite@5.4.9_@types+node@22.7.7_terser@5.43.1/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/Final%20Year%20Project/beyond-the-class/apps/web/beyond-the-class/node_modules/.pnpm/@vitejs+plugin-react-swc@3._88f6122bfc4d9a073cc15885d5c81491/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { createHtmlPlugin } from "file:///D:/Projects/Final%20Year%20Project/beyond-the-class/apps/web/beyond-the-class/node_modules/.pnpm/vite-plugin-html@3.2.2_vite_c9f298c01d6c9548c4e7f25e20927a4b/node_modules/vite-plugin-html/dist/index.mjs";
import compression from "file:///D:/Projects/Final%20Year%20Project/beyond-the-class/apps/web/beyond-the-class/node_modules/.pnpm/vite-plugin-compression@0.5_565302d408c1d5aabc3ea1fc5d234db2/node_modules/vite-plugin-compression/dist/index.mjs";
import { imagetools } from "file:///D:/Projects/Final%20Year%20Project/beyond-the-class/apps/web/beyond-the-class/node_modules/.pnpm/vite-imagetools@7.1.0_rollup@4.24.0/node_modules/vite-imagetools/dist/index.js";
import { visualizer } from "file:///D:/Projects/Final%20Year%20Project/beyond-the-class/apps/web/beyond-the-class/node_modules/.pnpm/rollup-plugin-visualizer@6.0.3_rollup@4.24.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({ minify: true }),
    // Minifies index.html
    compression({ algorithm: "brotliCompress" }),
    // Adds .br compressed versions of JS/CSS/HTML
    imagetools(),
    visualizer({ open: true })
  ],
  server: {
    port: "4352",
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    // Increased to reduce warnings for large chunks
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 4,
        // More passes for better compression
        pure_funcs: ["console.log", "console.info", "console.warn"],
        // Remove specific calls
        dead_code: true,
        // Remove dead code
        drop_debugger: true,
        drop_console: true,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true
        // unsafe_math: true,
        // unsafe_proto: true,
        // unsafe_regexp: true,
        // unsafe_undefined: true
      },
      mangle: true,
      // mangle: {
      //   toplevel: true,
      //   // safari10: true
      // },
      module: true,
      toplevel: true,
      format: {
        comments: false,
        beautify: false
      }
    },
    cssCodeSplit: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "ui-vendor": ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          "pdf-vendor": ["react-pdf", "pdfjs-dist"],
          "map-vendor": ["@react-google-maps/api", "google-map-react"],
          "utils-vendor": ["axios", "lodash", "date-fns"],
          "other-vendor": ["framer-motion", "react-hot-toast", "react-icons", "react-dropzone"]
        }
      }
    }
  }
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('node_modules')) {
  //           return id.toString().split('node_modules/')[1].split('/')[0].toString();
  //         }
  //       }
  //     }
  //   }
  // }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxGaW5hbCBZZWFyIFByb2plY3RcXFxcYmV5b25kLXRoZS1jbGFzc1xcXFxhcHBzXFxcXHdlYlxcXFxiZXlvbmQtdGhlLWNsYXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxGaW5hbCBZZWFyIFByb2plY3RcXFxcYmV5b25kLXRoZS1jbGFzc1xcXFxhcHBzXFxcXHdlYlxcXFxiZXlvbmQtdGhlLWNsYXNzXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9GaW5hbCUyMFllYXIlMjBQcm9qZWN0L2JleW9uZC10aGUtY2xhc3MvYXBwcy93ZWIvYmV5b25kLXRoZS1jbGFzcy92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnXHJcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1odG1sJ1xyXG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nXHJcbmltcG9ydCB7aW1hZ2V0b29sc30gZnJvbSAndml0ZS1pbWFnZXRvb2xzJ1xyXG5pbXBvcnQge3Zpc3VhbGl6ZXJ9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7IG1pbmlmeTogdHJ1ZSB9KSwgLy8gTWluaWZpZXMgaW5kZXguaHRtbFxyXG4gICAgY29tcHJlc3Npb24oeyBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycgfSksIC8vIEFkZHMgLmJyIGNvbXByZXNzZWQgdmVyc2lvbnMgb2YgSlMvQ1NTL0hUTUxcclxuICAgIGltYWdldG9vbHMoKSxcclxuICAgIHZpc3VhbGl6ZXIoeyBvcGVuOiB0cnVlIH0pXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IFwiNDM1MlwiLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfSxcclxuICBcclxuICBidWlsZDoge1xyXG4gICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyBJbmNyZWFzZWQgdG8gcmVkdWNlIHdhcm5pbmdzIGZvciBsYXJnZSBjaHVua3NcclxuICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcblxyXG4gICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIHBhc3NlczogNCwgLy8gTW9yZSBwYXNzZXMgZm9yIGJldHRlciBjb21wcmVzc2lvblxyXG4gICAgICAgIHB1cmVfZnVuY3M6IFsnY29uc29sZS5sb2cnLCAnY29uc29sZS5pbmZvJywgJ2NvbnNvbGUud2FybiddLCAvLyBSZW1vdmUgc3BlY2lmaWMgY2FsbHNcclxuICAgICAgICBkZWFkX2NvZGU6IHRydWUsIC8vIFJlbW92ZSBkZWFkIGNvZGVcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxyXG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICBwdXJlX2dldHRlcnM6IHRydWUsXHJcbiAgICAgICAgdW5zYWZlOiB0cnVlLFxyXG4gICAgICAgIHVuc2FmZV9jb21wczogdHJ1ZSxcclxuICAgICAgICB1bnNhZmVfRnVuY3Rpb246IHRydWUsXHJcbiAgICAgICAgLy8gdW5zYWZlX21hdGg6IHRydWUsXHJcbiAgICAgICAgLy8gdW5zYWZlX3Byb3RvOiB0cnVlLFxyXG4gICAgICAgIC8vIHVuc2FmZV9yZWdleHA6IHRydWUsXHJcbiAgICAgICAgLy8gdW5zYWZlX3VuZGVmaW5lZDogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBtYW5nbGU6IHRydWUsXHJcbiAgICAgIC8vIG1hbmdsZToge1xyXG4gICAgICAvLyAgIHRvcGxldmVsOiB0cnVlLFxyXG4gICAgICAvLyAgIC8vIHNhZmFyaTEwOiB0cnVlXHJcbiAgICAgIC8vIH0sXHJcbiAgICAgIG1vZHVsZTogdHJ1ZSxcclxuICAgICAgdG9wbGV2ZWw6IHRydWUsXHJcbiAgICAgIFxyXG4gICAgICBmb3JtYXQ6IHtcclxuICAgICAgICBjb21tZW50czogZmFsc2UsXHJcbiAgICAgICAgYmVhdXRpZnk6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXHJcbiAgICBjc3NNaW5pZnk6IHRydWUsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgLy8gVmVuZG9yIGNodW5rcyBmb3IgYmV0dGVyIGNhY2hpbmdcclxuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxyXG4gICAgICAgICAgJ3JvdXRlci12ZW5kb3InOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuICAgICAgICAgICd1aS12ZW5kb3InOiBbJ0BtdWkvbWF0ZXJpYWwnLCAnQG11aS9pY29ucy1tYXRlcmlhbCcsICdAZW1vdGlvbi9yZWFjdCcsICdAZW1vdGlvbi9zdHlsZWQnXSxcclxuICAgICAgICAgICdwZGYtdmVuZG9yJzogWydyZWFjdC1wZGYnLCAncGRmanMtZGlzdCddLFxyXG4gICAgICAgICAgJ21hcC12ZW5kb3InOiBbJ0ByZWFjdC1nb29nbGUtbWFwcy9hcGknLCAnZ29vZ2xlLW1hcC1yZWFjdCddLFxyXG4gICAgICAgICAgJ3V0aWxzLXZlbmRvcic6IFsnYXhpb3MnLCAnbG9kYXNoJywgJ2RhdGUtZm5zJ10sXHJcbiAgICAgICAgICAnb3RoZXItdmVuZG9yJzogWydmcmFtZXItbW90aW9uJywgJ3JlYWN0LWhvdC10b2FzdCcsICdyZWFjdC1pY29ucycsICdyZWFjdC1kcm9wem9uZSddXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIGJ1aWxkOiB7XHJcbiAgLy8gICByb2xsdXBPcHRpb25zOiB7XHJcbiAgLy8gICAgIG91dHB1dDoge1xyXG4gIC8vICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gIC8vICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gIC8vICAgICAgICAgICByZXR1cm4gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKTtcclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH1cclxuICAvLyAgIH1cclxuICAvLyB9XHJcblxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStaLFNBQVMsb0JBQW9CO0FBQzViLE9BQU8sV0FBVztBQUNsQixTQUFTLHdCQUF3QjtBQUNqQyxPQUFPLGlCQUFpQjtBQUN4QixTQUFRLGtCQUFpQjtBQUN6QixTQUFRLGtCQUFpQjtBQUV6QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixpQkFBaUIsRUFBRSxRQUFRLEtBQUssQ0FBQztBQUFBO0FBQUEsSUFDakMsWUFBWSxFQUFFLFdBQVcsaUJBQWlCLENBQUM7QUFBQTtBQUFBLElBQzNDLFdBQVc7QUFBQSxJQUNYLFdBQVcsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUFBLEVBQzNCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixTQUFTLENBQUMsU0FBUztBQUFBLE1BQ3JCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLHVCQUF1QjtBQUFBO0FBQUEsSUFDdkIsUUFBUTtBQUFBLElBRVIsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsUUFBUTtBQUFBO0FBQUEsUUFDUixZQUFZLENBQUMsZUFBZSxnQkFBZ0IsY0FBYztBQUFBO0FBQUEsUUFDMUQsV0FBVztBQUFBO0FBQUEsUUFDWCxlQUFlO0FBQUEsUUFDZixjQUFjO0FBQUEsUUFDZCxjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxpQkFBaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS25CO0FBQUEsTUFDQSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtSLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUVWLFFBQVE7QUFBQSxRQUNOLFVBQVU7QUFBQSxRQUNWLFVBQVU7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBO0FBQUEsVUFFWixnQkFBZ0IsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUNyQyxpQkFBaUIsQ0FBQyxrQkFBa0I7QUFBQSxVQUNwQyxhQUFhLENBQUMsaUJBQWlCLHVCQUF1QixrQkFBa0IsaUJBQWlCO0FBQUEsVUFDekYsY0FBYyxDQUFDLGFBQWEsWUFBWTtBQUFBLFVBQ3hDLGNBQWMsQ0FBQywwQkFBMEIsa0JBQWtCO0FBQUEsVUFDM0QsZ0JBQWdCLENBQUMsU0FBUyxVQUFVLFVBQVU7QUFBQSxVQUM5QyxnQkFBZ0IsQ0FBQyxpQkFBaUIsbUJBQW1CLGVBQWUsZ0JBQWdCO0FBQUEsUUFDdEY7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYUYsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
