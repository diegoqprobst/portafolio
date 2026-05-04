import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "sans-serif"] },
      colors: {
        electric: "#1E90FF",
        dark: "#0D1117",
        glass: "rgba(22, 27, 34, 0.7)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "blink-caret": "blink-caret 0.75s step-end infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "blink-caret": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#1E90FF" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
