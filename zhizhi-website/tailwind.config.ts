import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1E88E5",
          dark: "#1565C0",
        },
        secondary: "#43A047",
        accent: "#FF9800",
      },
    },
  },
  plugins: [],
};

export default config;