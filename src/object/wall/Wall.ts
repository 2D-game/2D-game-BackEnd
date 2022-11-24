import { IObject, Type } from '../IObject'
import { Player } from '../../player'

export class Wall implements IObject {
	isSolid(): boolean {
		return true
	}

	getType(): Type {
		return Type.WALL
	}

	collect(player: Player): void { }
}
