import { Server as SocketServer, Socket } from 'socket.io'
import { Lobby } from './lobby'
import { PlayerHandler } from './player_handler'
import { Player } from './Player'
import { Error, newError, newRes, Res } from './response'

type CreateLobbyRes = {
	id: string
}

const errNotFound = newError('Lobby not found')
const errAlreadyJoined = newError('Already joined a lobby')

export class Server implements PlayerHandler {
	private io: SocketServer
	private players: Map<Socket, Player>
	private lobbies: Map<string, Lobby>

	constructor(io: SocketServer) {
		this.io = io
		this.players = new Map()
		this.lobbies = new Map()
		io.on('connection', (socket) => this.onConnect(new Player(socket)))
	}

	onConnect(player: Player) {
		this.players.set(player.getSocket(), player)
		player.on('disconnect', () => this.onDisconnect(player))
		player.on('create_lobby', (ev) => this.onCreateLobby(ev, player))
		player.on('join_lobby', (ev, id: string) => this.onJoinLobby(ev, player, id))
	}

	onDisconnect(player: Player) {
		console.log(player)

		const lobby = player.getLobby()
		if (lobby !== null) {
			lobby.onDisconnect(player)
			if (lobby.isEmpty()) {
				this.lobbies.delete(lobby.getID())
			}
		}

		this.players.delete(player.getSocket())
	}

	onCreateLobby(ev: string, player: Player) {
		if (player.getLobby() !== null) {
			player.emit(ev, errAlreadyJoined)
			return
		}

		const lobby = new Lobby()
		this.lobbies.set(lobby.getID(), lobby)
		lobby.onConnect(player)

		player.emit(ev, newRes<CreateLobbyRes>({
			id: lobby.getID()
		}))
	}


	onJoinLobby(ev: string, player: Player, id: string) {
		const lobby = this.lobbies.get(id)
		if (lobby === undefined) {
			player.emit(ev, errNotFound)
			return
		} else if (player.getLobby() !== null) {
			player.emit(ev, errAlreadyJoined)
			return
		}

		lobby.onConnect(player)
	}
}
