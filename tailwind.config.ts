import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-hind-siliguri)", "Hind Siliguri", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          purple: "#6339DF",
          deep: "#4213B8",
          bg: "#F7F6FC",
          surface: "#FFFFFF",
          text: "#17152F",
          muted: "#6B688D",
          border: "#EAE8F5",
          gold: "#FFC400",
          green: "#10B981",
          blue: "#168FE7",
          rose: "#F43F5E",
        },
      },
    },
  },
  plugins: [],
};

export default config;