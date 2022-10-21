export enum Type {
	NULL = 'NULL',
	WALL = 'WALL',
	LAVA = 'LAVA',
	WATER = 'WATER',
	FINISH = 'FINISH'
}

export interface IObject {
	isSolid(): boolean
	getType(): Type
}
