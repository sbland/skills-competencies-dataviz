import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    'process.env.NODE_ENV': "'production'"
  },
  build: {
    lib: {
      entry: {
        main: path.resolve(__dirname, "lib/main.js"),
      },
      name: "skills-competencies-dataviz",
      fileName: "skills-competencies-dataviz",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library.
      // Commented out until React imported as UMD
      external: ["react", 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          'react-dom': "ReactDOM",
        },
      },
    },
  },
});
