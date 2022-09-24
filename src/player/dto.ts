import { z } from 'zod'
import { Coordinates } from '../map'

// Move
export enum Direction {
	UP = 'UP',
	DOWN = 'DOWN',
	LEFT = 'LEFT',
	RIGHT = 'RIGHT'
}

export const MoveReq = z.object({
	direction: z.nativeEnum(Direction)
})
export type MoveReq = z.infer<typeof MoveReq>

export type MoveRes = {
	id: string
	coords: Coordinates
}
