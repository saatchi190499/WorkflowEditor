import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // по умолчанию только для .jsx, но ниже добавим и для .js
    include: /\.js$/, // все .js файлы обрабатываются как JSX
  }
})
