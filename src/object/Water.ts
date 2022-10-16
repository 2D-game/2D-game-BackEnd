import { IObject, Type } from './IObject'

export class Water implements IObject {
	isSolid(): boolean {
		return true
	}

	getType(): Type {
		return Type.WATER
	}
}
