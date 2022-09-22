import { Socket } from 'socket.io'

type Error = {
	message: string
}

type Response = {
	error: Error | null
	data: any
}

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

	public wrapErrHandler(handler: (ev: string, ...args: any[]) => void): (ev: string, ...args: any[]) => void {
		return (ev: string, ...args: any[]) => {
			try {
				handler(ev, ...args)
			} catch (e: any) {
				if (e instanceof Error) {
					this.emitErr(ev, e.message)
				}
			}
		}
	}

	private emitErr(event: string, message: string): void {
		this.socket.emit(event, <Response>{
			error: <Error>{
				message: message,
			},
			data: null,
		})
	}

	public emit(event: string, arg: any): void {
		this.socket.emit(event, <Response>{
			error: null,
			data: arg,
		})
	}
}
