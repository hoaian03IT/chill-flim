/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'banner' : "url('./assets/banner.jpg')",
        'login' : "url('./assets/bg-login.jpg')",
      }
    },
  },
  plugins: [],
}

