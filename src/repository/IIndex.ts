export interface IIndex<Type> {
	insert(t: Type): void
	delete(t: Type): void
}
