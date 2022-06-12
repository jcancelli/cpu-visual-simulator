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
      },
      boxShadow: {
        "component": "0 0 10px rgba(0, 0, 0, 0.2)",
        "cpu": "0 0 20px rgba(0, 0, 0, 0.3)"
      },
      dropShadow: {
        "component": "0 0 10px rgba(0, 0, 0, 0.2)"
      },
      colors: {
        "gray": {
          "100": "#e0e0e0",
          "200": "#d0d0d0",
          "300": "#c0c0c0",
          "400": "#b0b0b0",
          "500": "#a0a0a0",
          "600": "#808080"
        }
      }
    },
  },
  plugins: [],
}
