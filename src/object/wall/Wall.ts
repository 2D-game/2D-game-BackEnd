import { IObject, Type } from '../IObject'

export class Wall implements IObject {
	isSolid(): boolean {
		return true
	}

	getType(): Type {
		return Type.WALL
	}
}
