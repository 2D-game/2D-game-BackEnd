import { IObject, Type } from './IObject'
import { Player } from '../player'

export class Water implements IObject {
	isSolid(): boolean {
		return true
	}

	getType(): Type {
		return Type.WATER
	}

	collect(player: Player): boolean { return true }
}
