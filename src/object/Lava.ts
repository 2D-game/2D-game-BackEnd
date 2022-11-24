import { IObject, Type } from './IObject'
import { Player } from '../player'

export class Lava implements IObject {
	isSolid(): boolean {
		return true
	}

	getType(): Type {
		return Type.LAVA
	}

	collect(player: Player): void { }
}
