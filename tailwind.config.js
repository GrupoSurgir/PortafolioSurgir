/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#000000",
        panel: "#0a0a0c",
        accent: "#7dd3fc",
      },
    },
  },
  plugins: [],
};
