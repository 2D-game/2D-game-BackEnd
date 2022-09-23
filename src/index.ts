import express from 'express'
import * as http from 'http'
import { Server as SocketServer } from 'socket.io'

import * as session from './session'
import * as lobby from './lobby'
import * as game from './game'
import * as player from './player'
import * as server from './server'

const app = express()
const httpServer = http.createServer(app)
const io = new SocketServer(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})

const sessions = new session.Sessions()

const playerEvBus = new player.EventBus()
const lobbyEvBus = new lobby.EventBus()

const sessionUcase = new session.Usecase(sessions)
const playerUcase = new player.Usecase(sessions, playerEvBus)
const lobbyUcase = new lobby.Usecase(playerUcase, lobbyEvBus, playerEvBus)
const gameUcase = new game.Usecase(playerEvBus)

const playerHndFact = new player.HandlerFactory(playerUcase, sessionUcase, playerEvBus)
const lobbyHndFact = new lobby.HandlerFactory(io, lobbyUcase, sessionUcase, lobbyEvBus)
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

