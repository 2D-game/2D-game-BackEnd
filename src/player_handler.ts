import { Player } from './Player'

export interface PlayerHandler {
	  onConnect: (player: Player) => void;
	  onDisconnect: (player: Player) => void;
}
