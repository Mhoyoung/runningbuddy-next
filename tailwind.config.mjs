/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // 기존 것 유지
        brand: {
          primary: "#000000",
          secondary: "#8F8F8F",
          accent: "#FF3B30",
        },
      },

      borderRadius: {
        card: "18px",
        button: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
