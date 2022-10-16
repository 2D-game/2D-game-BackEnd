import { IObject, Type } from './IObject'

export class Lava implements IObject {
	isSolid(): boolean {
		return true
	}

	getType(): Type {
		return Type.LAVA
	}
}
