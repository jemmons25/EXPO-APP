import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#09090b",
          900: "#101013",
          850: "#16161a",
          800: "#1c1c21",
          700: "#26262e",
          600: "#34343e",
          500: "#4c4c58",
          400: "#71717f",
          300: "#a1a1ac",
          200: "#d4d4da",
          100: "#ececef",
          50: "#fafafb",
        },
        brand: {
          DEFAULT: "#6366f1",
          soft: "#818cf8",
          strong: "#4f46e5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotateX(8deg) rotateY(-12deg)" },
          "50%": { transform: "translateY(-14px) rotateX(4deg) rotateY(-8deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
