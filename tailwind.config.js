/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        DefaultColor: '#ef5239 ',
        DefaultSecondColor: '#022457',
      },
    },
  },
  plugins: [],
}

