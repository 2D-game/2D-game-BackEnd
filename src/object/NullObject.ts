import { IObject } from './IObject'

export class NullObject implements IObject {
	isSolid(): boolean {
		return false
	}
}
