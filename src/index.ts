import * as session from './session'
import * as lobby from './lobby'
import * as player from './player'

const sessionRepo = new session.Repository()
const lobbyRepo = new lobby.Repository()
const playerRepo = new player.Repository(lobbyRepo.getIndex(), sessionRepo.getIndex())
const lobbyUcase = new lobby.Usecase(lobbyRepo, playerRepo, sessionRepo)

const [ss1, res1] = lobbyUcase.createLobby({ username: 'foo' })
console.log(ss1, res1)

const [ss2, res2] = lobbyUcase.joinLobby({ id: res1.id, username: 'bar' })
console.log(ss2, res2)

console.log(lobbyUcase.getPlayers(ss2.getPlayer()))
