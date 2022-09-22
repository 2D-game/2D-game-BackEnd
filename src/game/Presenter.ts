import * as dto from './dto'
import { Game } from './'

export class Presenter {
	static getStartRes(game: Game): dto.StartRes {
		const map = game.getMap()
		const height = map.getHeight()
		const width = map.getWidth()
		const objects = new Array(height)
		for (let i = 0; i < height; i++) {
			objects[i] = new Array(width)
			for (let j = 0; j < width; j++) {
				objects[i][j] = map.getObjectAt(j, i).getType()
			}
		}

		return {
			map: {
				height: map.getHeight(),
				width: map.getWidth(),
				objects: objects
			}
		}
	}
}
