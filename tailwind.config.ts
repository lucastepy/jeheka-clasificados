import type { Config } from "tailwindcss";

// Tailwind CSS v4.0 is primarily configured in CSS.
// This file helps IDE plugins (like Tailwind CSS IntelliSense) find the project root.
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
