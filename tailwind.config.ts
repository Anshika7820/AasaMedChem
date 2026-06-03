import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        line: "#d8dee4",
        brand: "#0f766e",
        accent: "#b45309"
      },
      boxShadow: {
        soft: "0 14px 35px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
