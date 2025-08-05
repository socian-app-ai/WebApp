import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { createHtmlPlugin } from 'vite-plugin-html'
import compression from 'vite-plugin-compression'
import {imagetools} from 'vite-imagetools'
import {visualizer} from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({ minify: true }), // Minifies index.html
    compression({ algorithm: 'brotliCompress' }), // Adds .br compressed versions of JS/CSS/HTML
    imagetools(),
    visualizer({ open: true })
  ],
  server: {
    port: "4352",
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      },
    }
  },
  
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 500, // Increased to reduce warnings for large chunks
    minify: 'terser',

    terserOptions: {
      compress: {
        passes: 4, // More passes for better compression
        pure_funcs: ['console.log', 'console.info', 'console.warn'], // Remove specific calls
        dead_code: true, // Remove dead code
        drop_debugger: true,
        drop_console: true,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true,
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
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'pdf-vendor': ['react-pdf', 'pdfjs-dist'],
          'map-vendor': ['@react-google-maps/api', 'google-map-react'],
          'utils-vendor': ['axios', 'lodash', 'date-fns'],
          'other-vendor': ['framer-motion', 'react-hot-toast', 'react-icons', 'react-dropzone']
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

})
