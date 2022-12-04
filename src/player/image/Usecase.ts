import axios from 'axios'

export class Usecase {
	async downloadSVGImage(): Promise<string> {
		// Download SVG image from remote URL "https://www.iconfinder.com/icons/7033730/download/svg/4096" and encode it as base64
		const response = await axios.get('https://www.iconfinder.com/icons/7033730/download/svg/4096', {
			responseType: 'arraybuffer',
		})
		const buffer = Buffer.from(response.data, 'binary')
		return buffer.toString('base64')
	}
}
