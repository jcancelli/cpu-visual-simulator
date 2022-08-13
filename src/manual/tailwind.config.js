/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./public/manual.html", "./src/manual/**/*.svelte", "./src/shared/**/*.svelte"],
	theme: {
		extend: {
			colors: {
				gray: {
					100: "#e0e0e0",
					200: "#d0d0d0",
					300: "#c0c0c0",
					400: "#b0b0b0",
					500: "#a0a0a0",
					600: "#808080",
					700: "#707070",
					800: "#606060"
				}
			},
			gridTemplateColumns: {
				tabgroup: "1.5fr 8fr"
			}
		}
	},
	plugins: []
}
