import { Socket } from 'socket.io'
import { ZodError } from 'zod'

type Error = {
	message: string
	data: any
}

type Response = {
	error: Error | null
	data: any
}

const ErrInvalidInput = 'Invalid input'

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
				if (e instanceof ZodError) {
					this.emitErr(ev, ErrInvalidInput, e.format())
				} else if (e instanceof Error) {
					this.emitErr(ev, e.message, null)
				}
			}
		}
	}

	private emitErr(event: string, message: string, data: any): void {
		this.socket.emit(event, <Response>{
			error: <Error>{
				message: message,
				data: data,
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
