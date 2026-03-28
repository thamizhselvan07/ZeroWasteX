/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          900: "#701a75",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(217, 70, 239, 0.5)",
        "glow-lg": "0 0 50px rgba(236, 72, 153, 0.6)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top left, rgba(168, 85, 247, 0.4), transparent 40%), radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.4), transparent 40%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
        "mesh-gradient": "radial-gradient(at 40% 20%, hsla(280,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)"
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'drift': 'drift 15s linear infinite',
        'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%': { transform: 'translate(0px, 0px)' },
          '33%': { transform: 'translate(30px, -50px)' },
          '66%': { transform: 'translate(-20px, 20px)' },
          '100%': { transform: 'translate(0px, 0px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '.7', filter: 'brightness(1.5)' },
        }
      }
    },
  },
  plugins: [],
};
