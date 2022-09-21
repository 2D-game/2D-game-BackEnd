// import { Server as SocketServer, Socket } from 'socket.io'
// import { Lobbya } from './lobbya'
// import { PlayerHandler } from './player_handler'
// import { Player } from '../src/player/Player'
// import { newError, newRes } from './response'
//
// type CreateLobbyReq = {
// 	username: string
// }
//
// type CreateLobbyRes = {
// 	id: string
// }
//
// type JoinLobbyReq = {
// 	id: string
// 	username: string
// }
//
// type JoinLobbyRes = {
// 	id: string
// }
//
// const errNotFound = newError('Lobby not found')
// const errAlreadyJoined = newError('Already joined a lobby')
//
// export class Server implements PlayerHandler {
// 	private io: SocketServer
// 	private players: Map<Socket, Player>
// 	private lobbies: Map<string, Lobbya>
//
// 	constructor(io: SocketServer) {
// 		this.io = io
// 		this.players = new Map()
// 		this.lobbies = new Map()
// 		io.on('connection', (socket) => this.onConnect(new Player(socket)))
// 	}
//
// 	onConnect(player: Player) {
// 		this.players.set(player.getSocket(), player)
//
// 		player.on('disconnect', () => this.onDisconnect(player))
// 		player.on('create_lobby', (ev, req: CreateLobbyReq) => this.onCreateLobby(ev, player, req))
// 		player.on('join_lobby', (ev, req: JoinLobbyReq) => this.onJoinLobby(ev, player, req))
// 	}
//
// 	onDisconnect(player: Player) {
// 		const lobby = player.getLobby()
// 		if (lobby !== null) {
// 			lobby.onDisconnect(player)
// 			if (lobby.isEmpty()) {
// 				this.lobbies.delete(lobby.getID())
// 			}
// 		}
//
// 		this.players.delete(player.getSocket())
// 	}
//
// 	onCreateLobby(ev: string, player: Player, req: CreateLobbyReq) {
// 		if (player.getLobby() !== null) {
// 			player.emit(ev, errAlreadyJoined)
// 			return
// 		}
//
// 		const lobby = new Lobbya()
// 		this.lobbies.set(lobby.getID(), lobby)
// 		lobby.onConnect(player, req.username)
//
// 		player.emit(ev, newRes<CreateLobbyRes>({
// 			id: lobby.getID()
// 		}))
// 	}
//
// 	onJoinLobby(ev: string, player: Player, req: JoinLobbyReq) {
// 		const lobby = this.lobbies.get(req.id)
// 		if (lobby === undefined) {
// 			player.emit(ev, errNotFound)
// 			return
// 		} else if (player.getLobby() !== null) {
// 			player.emit(ev, errAlreadyJoined)
// 			return
// 		}
//
// 		lobby.onConnect(player, req.username)
// 		player.emit(ev, newRes<JoinLobbyRes>({
// 			id: lobby.getID()
// 		}))
// 	}
// }
