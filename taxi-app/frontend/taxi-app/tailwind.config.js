/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true, // Centers the container by default
        screens: {
          xl: "1170px", // Set max width to 1170px for xl screens
          "2xl": "1170px", // Set max width to 1170px for 2xl screens
        },
      },
    },
  },
  plugins: [],
};
