/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#070A12",
        surface: "#0F1420",
        elevated: "#151C2E",
        line: "#232B3E",
        blue: {
          DEFAULT: "#3E7BFA",
          soft: "#3E7BFA33",
        },
        cyan: {
          DEFAULT: "#22D3EE",
          soft: "#22D3EE33",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          soft: "#8B5CF633",
        },
        ink: "#F5F7FA",
        muted: "#8B95A7",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(62,123,250,0.45)",
        glowCyan: "0 0 40px -10px rgba(34,211,238,0.45)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(62,123,250,0.18), transparent 60%)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        scan: "scan 2.4s linear infinite",
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
