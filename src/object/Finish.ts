import { IObject, Type } from './IObject'

export class Finish implements IObject {
	isSolid(): boolean {
		return false
	}

	getType(): Type {
		return Type.FINISH
	}
}
