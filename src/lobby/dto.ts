import { z } from 'zod'

// CreatePlayer
export const CreatePlayer = z.object({
	username: z.string().min(3).max(20),
})
export type CreatePlayer = z.infer<typeof CreatePlayer>

// Create
export const CreateReq = CreatePlayer
export type CreateReq = CreatePlayer

export type CreateRes = {
	id: string
}

// Join
export const JoinReq = CreatePlayer.merge(z.object({
	id: z.string().length(4),
}))
export type JoinReq = z.infer<typeof JoinReq>

export type JoinRes = {
	id: string
}

// GetPlayers
export type GetPlayersRes = {
	users: {
		id: string
		username: string
	}[]
}
