import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3B82F6", // Tailwind Blue-500
          DEFAULT: "#2563EB", // Tailwind Blue-600
          dark: "#1E40AF", // Tailwind Blue-900
        },
        secondary: {
          light: "#F3F4F6", // Gray-100
          DEFAULT: "#9CA3AF", // Gray-400
          dark: "#374151", // Gray-700
        },
        accent: {
          DEFAULT: "#FACC15", // Yellow-400
          dark: "#CA8A04", // Yellow-600
        },
        success: "#22C55E", // Green-500
        danger: "#EF4444",  // Red-500
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"], // βασική
        heading: ["Poppins", "system-ui", "sans-serif"], // για τίτλους
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
        "card-hover": "0 6px 20px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // για περιγραφές/άρθρα
    require("@tailwindcss/forms"), // για forms (filters/search)
    require("@tailwindcss/line-clamp"), // για line-clamp περιγραφών
  ],
};

export default config;
