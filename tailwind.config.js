/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ares: {
          red: '#ff3333',
          orange: '#ff6600',
          dark: '#0a0a0a',
        }
      }
    },
  },
  plugins: [],
}
