import express from 'express'
import * as http from 'http'
import { Server as SocketServer } from 'socket.io'

import * as session from './session'
import * as lobby from './lobby'
import * as player from './player'
import * as server from './server'

const sessionRepo = new session.Repository()
const sessionUcase = new session.Usecase(sessionRepo)

const lobbyRepo = new lobby.Repository()
const playerRepo = new player.Repository()
playerRepo
	.addIndex(sessionRepo.getPlayerIndex())
	.addIndex(lobbyRepo.getPlayerIndex())
const lobbyUcase = new lobby.Usecase(lobbyRepo, playerRepo, sessionRepo)
const lobbyHndFact = new lobby.HandlerFactory(lobbyUcase, sessionUcase)

const app = express()
const httpServer = http.createServer(app)
const io = new SocketServer(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})

new server.Handler(io, lobbyHndFact)

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
	console.log('Listening on port ' + port)
})

