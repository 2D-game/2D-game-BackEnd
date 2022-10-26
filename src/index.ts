import express from 'express'
import * as http from 'http'
import { Server as SocketServer } from 'socket.io'

import * as session from './session'
import * as lobby from './lobby'
import * as game from './game'
import * as player from './player'
import * as server from './server'
import { IObserver } from './util/Observer'

const app = express()
const httpServer = http.createServer(app)
const io = new SocketServer(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
})

const sessions = new session.Sessions()
const lobbies = new lobby.Lobbies()

const playerPub = new player.Publisher()
const lobbyPub = new lobby.Publisher()
const gamePub = new game.Publisher()

const lobbyFacade = new lobby.Facade(lobbies)

const sessionUcase = new session.Usecase(sessions)
const playerUcase = new player.Usecase(sessions, playerPub)
const lobbyUcase = new lobby.Usecase(lobbies, playerUcase, lobbyPub)
const gameUcase = new game.Usecase(lobbies, gamePub, lobbyFacade)

const obs: Array<IObserver> = [
	new lobby.PlayerObserver(playerPub, io, lobbyUcase),
	new lobby.Observer(lobbyPub, io, lobbyUcase),

	new game.LobbyObserver(lobbyPub, io, gameUcase),
	new game.PlayerObserver(playerPub, gameUcase),
	new game.Observer(gamePub, io, gameUcase)
]
obs.forEach((o) => o.start())

const playerHndFact = new player.HandlerFactory(io, playerUcase, sessionUcase)
const lobbyHndFact = new lobby.HandlerFactory(lobbyUcase, sessionUcase)
const gameHndFact = new game.HandlerFactory(gameUcase, sessionUcase)

new server.Server(io)
	.addHandlerFactory(lobbyHndFact)
	.addHandlerFactory(playerHndFact)
	.addHandlerFactory(gameHndFact)
	.registerListeners()

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
	console.log('Listening on port ' + port)
})
