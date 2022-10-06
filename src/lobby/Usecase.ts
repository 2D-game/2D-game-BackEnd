import { Event, Publisher, Lobby, Presenter } from './'
import { Player, Usecase as PlayerUsecase } from '../player'
import * as dto from './dto'
import { Session } from '../session'
import { Lobbies } from './Lobbies'

export class Usecase {
	private readonly lobbies: Lobbies
	private readonly playerUcase: PlayerUsecase
	private readonly pub: Publisher

	constructor(lobbies: Lobbies, playerUcase: PlayerUsecase, pub: Publisher) {
		this.lobbies = lobbies
		this.playerUcase = playerUcase
		this.pub = pub
	}

	create(req: dto.CreateReq): [Session, dto.CreateRes] {
		dto.CreateReq.parse(req)

		const lobby = new Lobby()
		this.lobbies.add(lobby)
		const session = this.playerUcase.create(req.username, lobby)

		return [session, {
			id: lobby.getID()
		}]
	}

	join(req: dto.JoinReq): [Session, dto.JoinRes] {
		dto.JoinReq.parse(req)

		const lobby = this.lobbies.get(req.id)
		const session = this.playerUcase.create(req.username, lobby)

		return [session, {
			id: lobby.getID()
		}]
	}

	getPlayers(lobby: Lobby): dto.GetPlayersRes {
		return Presenter.getPlayerRes(lobby.getPlayers())
	}

	addPlayer(player: Player) {
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}
		lobby.addPlayer(player)

		this.pub.publish(Event.PLAYER_LIST_CHANGE, lobby)
	}

	playerIsReady(player: Player) {
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}

		this.pub.publish(Event.PLAYER_READINESS_CHANGE, lobby)
	}

	deletePlayer(player: Player) {
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}
		lobby.deletePlayer(player)

		if (lobby.playerCount() === 0) {
			this.lobbies.delete(lobby.getID())
		} else {
			this.pub.publish(Event.PLAYER_LIST_CHANGE, lobby)
			this.pub.publish(Event.PLAYER_READINESS_CHANGE, lobby)
		}
	}
}
