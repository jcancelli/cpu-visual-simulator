// https://stackoverflow.com/a/34156339
export function download(content: any, fileName: string) {
	const a = document.createElement("a")
	const file = new Blob([content], { type: "text/plain" })
	a.href = URL.createObjectURL(file)
	a.download = fileName
	a.click()
}
