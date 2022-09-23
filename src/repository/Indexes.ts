import { IIndex } from './IIndex'

export class Indexes<Type> {
	private readonly indexes: IIndex<Type>[]

	constructor() {
		this.indexes = []
	}

	add(index: IIndex<Type>): this {
		this.indexes.push(index)
		return this
	}

	onInsert(t: Type) {
		this.indexes.forEach((index) => index.insert(t))
	}

	onDelete(t: Type) {
		this.indexes.forEach((index) => index.delete(t))
	}

	onUpdate(oldT: Type, newT: Type) {
		this.indexes.forEach((index) => index.update(oldT, newT))
	}
}
