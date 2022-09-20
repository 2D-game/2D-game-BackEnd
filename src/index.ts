import express from 'express'
import * as http from 'http'
import { Server as SocketServer } from 'socket.io'
import { Server as GameServer } from './server'

const app = express()
const httpServer = http.createServer(app)
const io = new SocketServer(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})

new GameServer(io)

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
	console.log('Listening on port ' + port)
})
