/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effdf3",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
        },
      },
      boxShadow: {
        glow: "0 20px 50px rgba(22, 163, 74, 0.14)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top left, rgba(187,247,208,0.75), transparent 35%), linear-gradient(135deg, #f0fdf4 0%, #ffffff 55%, #dcfce7 100%)",
      },
    },
  },
  plugins: [],
};
