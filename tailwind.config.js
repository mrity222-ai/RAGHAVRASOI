/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ranel: {
          bg: "#FAF4E8",
          cream: "#FBF5EB",
          lightCream: "#FDFBF7",
          dark: "#141414",
          black: "#000000",
          red: "#DE2323",
          sale: "#E52525",
          gray: "#737373",
          lightGray: "#ECE7DE",
          border: "#E5DEC9",
          borderCard: "#E6E1D8",
          gold: "#F39C12",
          brown: "#2B160C",
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Oswald", "Bebas Neue", "sans-serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.18em",
      }
    },
  },
  plugins: [],
};
