import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"], // This enables dark mode based on a 'class' (e.g., 'dark' class)
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["var(--font-Poppins)"], // Ensure '--font-Poppins' is defined in global CSS
        Josefin: ["var(--font-Josefin)"], // Fixed typo here
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))", // Radial gradient
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))", // Conic gradient
      },
      screens: {
        "1000px": "1000px", // Custom breakpoint for 1000px
        "1100px": "1100px", // Custom breakpoint for 1100px
        "1200px": "1200px", // Custom breakpoint for 1200px
        "1300px": "1300px", // Custom breakpoint for 1300px
        "1500px": "1500px", // Custom breakpoint for 1500px
        "800px": "800px",   // Custom breakpoint for 800px
        "400px": "400px",   // Custom breakpoint for 400px
      },
    },
  },
  plugins: [], // Add any plugins here if required
};

export default config;

