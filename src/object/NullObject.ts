import { IObject, Type } from './IObject'
import { Player } from '../player'

export class NullObject implements IObject {
	isSolid(): boolean {
		return false
	}

	getType(): Type {
		return Type.NULL
	}

	collect(player: Player): void { }
}
