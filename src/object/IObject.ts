import { Player } from '../player'

export enum Type {
	NULL = 'NULL',
	WALL = 'WALL',
	LAVA = 'LAVA',
	WATER = 'WATER',
	FINISH = 'FINISH',
	APPLE = 'APPLE',
	PEAR = 'PEAR',
	PORTAL = 'PORTAL',
	BOX = 'BOX',
	GIFT_BOX = 'GIFT_BOX',
	BAD_APPLE = 'BAD_APPLE'
}

export interface IObject {
	isSolid(): boolean
	getType(): Type
	collect(player: Player): boolean
}
