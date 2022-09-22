import { IObject, Type } from './IObject'

export class NullObject implements IObject {
	isSolid(): boolean {
		return false
	}

	getType(): Type {
		return Type.NULL
	}
}
