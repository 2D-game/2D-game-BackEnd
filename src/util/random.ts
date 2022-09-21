export function digits(len: number): string {
	const chars = '0123456789'
	let id = ''
	for (let i = 0; i < len; i++) {
		id += chars[Math.floor(Math.random() * chars.length)]
	}
	return id
}
