import { IObserver } from '../util/Observer'
import { Event as MapEv, MapChange, Publisher as MapPub } from './Publisher'
import { Server as IOServer } from 'socket.io'
import { ExtendedSocket } from '../util/Socket'
import { Presenter } from '../game'

export class Observer implements IObserver {
	private readonly mapPub: MapPub
	private readonly io: IOServer

	constructor(mapPub: MapPub, io: IOServer) {
		this.mapPub = mapPub
		this.io = io
	}

	start() {
		this.mapPub.subscribe(
			MapEv.MAP_CHANGE,
			this.onMapChange.bind(this)
		)
	}

	stop() {
		this.mapPub.unsubscribe(
			MapEv.MAP_CHANGE,
			this.onMapChange.bind(this)
		)
	}

	private onMapChange(mapChange: MapChange) {
		const res = ExtendedSocket.response(Presenter.formatMap(mapChange.map))
		this.io.to(mapChange.game.getID()).emit('map_change', res)
	}
}
