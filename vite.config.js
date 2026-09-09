import { defineConfig } from "vite";

const plugins = [];
if (!process.env.VERCEL) {
  try {
    const { default: netlify } = await import("@netlify/vite-plugin");
    plugins.push(netlify());
  } catch {
    // Netlify plugin is optional outside Netlify
  }
}

export default defineConfig({
  plugins,
});
