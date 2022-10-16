export enum Type {
	NULL = 'NULL',
	WALL = 'WALL',
	LAVA = 'LAVA',
	WATER = 'WATER'
}

export interface IObject {
	isSolid(): boolean
	getType(): Type
}
