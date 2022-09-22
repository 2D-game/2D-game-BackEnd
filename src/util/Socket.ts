import { Socket } from 'socket.io'

export class ExtendedSocket {
	private readonly socket: Socket

	constructor(socket: Socket) {
		this.socket = socket
	}

	public underlying(): Socket {
		return this.socket
	}

	public on(ev: string, listener: (ev: string, ...args: any[]) => void): void {
		this.socket.on(ev, (...args: any[]) => {
			listener(ev, ...args)
		})
	}

	public emit(event: string, ...args: any[]): void {
		this.socket.emit(event, ...args)
	}
}
