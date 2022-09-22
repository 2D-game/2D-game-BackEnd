import express from 'express'
import * as http from 'http'
import { Server as SocketServer } from 'socket.io'

import * as session from './session'
import * as lobby from './lobby'
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

const sessionRepo = new session.Repository()
const sessionUcase = new session.Usecase(sessionRepo)

const lobbyRepo = new lobby.Repository()
const playerRepo = new player.Repository()
playerRepo
	.addIndex(sessionRepo.getPlayerIndex())
	.addIndex(lobbyRepo.getPlayerIndex())
const lobbyEvBus = new lobby.EventBus()
const lobbyUcase = new lobby.Usecase(lobbyRepo, playerRepo, sessionRepo, lobbyEvBus)
const lobbyHndFact = new lobby.HandlerFactory(io, lobbyUcase, sessionUcase, lobbyEvBus)

new server.Server(io)
	.addHandlerFactory(lobbyHndFact)
	.registerListeners()

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
	console.log('Listening on port ' + port)
})

