import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-eb-garamond)", "Georgia", "serif"],
        mono: ["var(--font-ibm-plex-mono)", "Courier New", "monospace"],
      },
      colors: {
        paper: "#F8F7F3",
        ink: "#1A1A1A",
        muted: "#666666",
        border: "#E0E0E0",
        faint: "#E8E8E8",
      },
    },
  },
  plugins: [],
};

export default config;
