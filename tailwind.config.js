/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        editor: {
          sidebar: "#3730a3",
          "sidebar-dark": "#312e81",
          page: "#ffffff",
          background: "#f9fafb",
        },
      },
      fontFamily: {
        times: ["Times New Roman", "serif"],
        arial: ["Arial", "sans-serif"],
        calibri: ["Calibri", "sans-serif"],
        georgia: ["Georgia", "serif"],
        verdana: ["Verdana", "sans-serif"],
        helvetica: ["Helvetica", "sans-serif"],
      },
      spacing: {
        "a4-width": "794px",
        "a4-height": "1123px",
        "page-margin": "40px",
      },
      screens: {
        print: { raw: "print" },
      },
    },
  },
  plugins: [],
};
