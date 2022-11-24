import { Player } from '../player'

export enum Type {
	NULL = 'NULL',
	WALL = 'WALL',
	LAVA = 'LAVA',
	WATER = 'WATER',
	FINISH = 'FINISH',
	APPLE = 'APPLE',
}

export interface IObject {
	isSolid(): boolean
	getType(): Type
	collect(player: Player): void
}
