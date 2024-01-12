import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "spec/NativeLangCode": resolve(__dirname, "src/spec/NativeLangCode.ts"),
      },
    },
    rollupOptions: {
      external: ["react", "react-native"],
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
