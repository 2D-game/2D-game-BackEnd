export type CreatePlayer = {
	username: string
}

export type CreateLobbyReq = CreatePlayer

export type CreateLobbyRes = {
	id: string
}

export type JoinLobbyReq = CreatePlayer & {
	id: string
}

export type JoinLobbyRes = {
	id: string
}
