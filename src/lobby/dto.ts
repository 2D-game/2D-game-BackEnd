import { z } from 'zod'

export const CreatePlayer = z.object({
	username: z.string().min(3).max(20),
})
export type CreatePlayer = z.infer<typeof CreatePlayer>

export const CreateLobbyReq = CreatePlayer
export type CreateLobbyReq = CreatePlayer

export type CreateLobbyRes = {
	id: string
}

export const JoinLobbyReq = CreatePlayer.merge(z.object({
	id: z.string().length(4),
}))
export type JoinLobbyReq = z.infer<typeof JoinLobbyReq>

export type JoinLobbyRes = {
	id: string
}

export type GetPlayersRes = {
	users: {
		id: string
		username: string
	}[]
}
