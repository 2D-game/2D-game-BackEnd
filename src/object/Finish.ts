import { IObject, Type } from './IObject'
import { Player } from '../player'

export class Finish implements IObject {
	isSolid(): boolean {
		return false
	}

	getType(): Type {
		return Type.FINISH
	}

	collect(player: Player): boolean { return true }
}
