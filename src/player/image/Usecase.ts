import axios from 'axios'
import { IUsecase } from './IUsecase'

export enum PlayerColor {
	RED = 'RED',
	PINK = 'PINK',
	WHITE = 'WHITE',
	BLUE = 'BLUE',
	ORANGE = 'ORANGE',
	GREEN = 'GREEN',
}

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class Usecase implements IUsecase {
	private readonly images = new Map<PlayerColor, string>(
		[
			[PlayerColor.RED, 'https://www.iconfinder.com/icons/7033731/download/png/48'],
			[PlayerColor.PINK, 'https://www.iconfinder.com/icons/7033734/download/png/48'],
			[PlayerColor.WHITE, 'https://www.iconfinder.com/icons/7033730/download/png/48'],
			[PlayerColor.BLUE, 'https://www.iconfinder.com/icons/7033729/download/png/48'],
			[PlayerColor.ORANGE, 'https://www.iconfinder.com/icons/7033737/download/png/48'],
			[PlayerColor.GREEN, 'https://www.iconfinder.com/icons/7033736/download/png/48']
		]
	)

	getUnusedColor(used: PlayerColor[]): PlayerColor {
		const unused = Array.from(this.images.keys()).filter((color) => !used.includes(color))
		if (unused.length === 0) {
			const colors = Array.from(this.images.keys())
			return colors[Math.floor(Math.random() * colors.length)]
		}
		return unused[0]
	}

	async getImage(color: PlayerColor): Promise<string> {
		await timeout(5000)
		const url = this.images.get(color) as string
		const response = await axios.get(url, {
			responseType: 'arraybuffer'
		})
		const buffer = Buffer.from(response.data, 'binary')
		return buffer.toString('base64')
	}
}
