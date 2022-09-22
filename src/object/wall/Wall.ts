import { IObject } from '../IObject'

export class Wall implements IObject {
	isSolid(): boolean {
		return true
	}
}
