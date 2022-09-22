export interface IIndex<Type> {
	insert(t: Type): void
	delete(t: Type): void
	update(oldT: Type, newT: Type): void
}
