/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.svelte"],
  theme: {
    extend: {
      width: {
        "app": "1400px"
      },
      height: {
        "app": "800px"
      }
    },
  },
  plugins: [],
}
