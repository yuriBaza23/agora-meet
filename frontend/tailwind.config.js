/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-meet': '#323232',
        'black-light': '#464646',
        'red-meet': '#FB8F88',
        'gray-meet': '#f4f4f4'
      }
    },
  },
  plugins: [],
}
