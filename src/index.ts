import * as session from './session'
import * as lobby from './lobby'
import * as player from './player'

const sessionRepo = new session.Repository()
const lobbyRepo = new lobby.Repository()
const playerRepo = new player.Repository(lobbyRepo.getIndex(), sessionRepo.getIndex())
const lobbyUcase = new lobby.Usecase(lobbyRepo, playerRepo, sessionRepo)

const [ss, res] = lobbyUcase.createLobby({ username: 'foo' })
