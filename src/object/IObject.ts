export enum Type {
	NULL = 'NULL',
	WALL = 'WALL',
}

export interface IObject {
	isSolid(): boolean
	getType(): Type
}
