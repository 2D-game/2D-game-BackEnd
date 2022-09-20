import { Player } from './Player'

export interface PlayerHandler {
	  onConnect: (player: Player, ...args: any[]) => void
	  onDisconnect: (player: Player, ...args: any[]) => void
}
