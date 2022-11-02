import { IHandler, IHandlerFactory } from '../server'
import * as dto from './'
import { Usecase as PlayerUsecase } from './'
import { Usecase as SessionUsecase } from '../session'
import { ExtendedSocket } from '../util/Socket'
import { Server as IOServer } from 'socket.io'
import { MoveCommand } from './command/MoveCommand'
import { ICommand } from './command/ICommand'
import { CommandHistory } from './command/CommandHistory'

export class HandlerFactory extends IHandlerFactory {
	private readonly io: IOServer
	private readonly playerUcase: PlayerUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(
		io: IOServer,
		playerUcase: PlayerUsecase,
		sessionUcase: SessionUsecase
	) {
		super()
		this.io = io
		this.playerUcase = playerUcase
		this.sessionUcase = sessionUcase
	}

	create(socket: ExtendedSocket) {
		return new Handler(this.io, socket, this.playerUcase, this.sessionUcase)
	}
}

export class Handler implements IHandler {
	private readonly io: IOServer
	private readonly socket: ExtendedSocket
	private readonly playerUcase: PlayerUsecase
	private readonly sessionUcase: SessionUsecase
	private readonly commandHistory : CommandHistory

	constructor(
		io: IOServer,
		socket: ExtendedSocket,
		playerUcase: PlayerUsecase,
		sessionUcase: SessionUsecase
	) {
		this.io = io
		this.socket = socket
		this.playerUcase = playerUcase
		this.sessionUcase = sessionUcase
		this.commandHistory = new CommandHistory()
	}

	public registerListeners() {
		const socket = this.socket
		socket.on('move', socket.wrapErrHandler(this.onMove.bind(this)))
		socket.on('force_next_level', socket.wrapErrHandler(this.onForceNextLevel.bind(this)))
		socket.on('set_ready', socket.wrapErrHandler(this.onSetReady.bind(this)))
		socket.underlying().on('disconnect', this.onDisconnect.bind(this))
	}

	public onMove(ev: string, req: dto.MoveReq) {
		const s = this.sessionUcase.authGuard(this.socket)
		const player = s.getPlayer()

		const game = player.getGame()
		if (game === null) {
			return
		}

		dto.MoveReq.parse(req)

		let res;

		switch (req.direction) {
			case dto.Direction.UNDO:
				res = this.undo();
				break;
			case dto.Direction.REDO:
				res = this.redoCommand();
				break;
			default:
				res = this.executeCommand(new MoveCommand(this.playerUcase, player, req.direction))
				break;
		}

		if (res !== undefined)
			this.io.to(game.getID()).emit(ev, ExtendedSocket.response(res))

	}

	public onForceNextLevel(ev: string) {
		const s = this.sessionUcase.authGuard(this.socket)
		const player = s.getPlayer()

		const game = player.getGame()
		if (game === null) {
			return
		}
		const res = this.playerUcase.forceNextLevel(player)

		this.io.to(game.getID()).emit(ev, ExtendedSocket.response(res))
	}

	public onSetReady(ev: string) {
		const s = this.sessionUcase.authGuard(this.socket)
		const player = s.getPlayer()

		const res = this.playerUcase.setReady(player)
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}
		this.io.to(lobby.getID()).emit(ev, ExtendedSocket.response(res))
	}

	public onDisconnect() {
		const ss = this.sessionUcase.getSession(this.socket)
		if (ss === null) {
			return
		}
		this.playerUcase.disconnect(ss)
	}

	public executeCommand(command : ICommand) : dto.MoveRes {
		this.commandHistory.push(command)
		return command.execute()
	}

	public redoCommand() : dto.MoveRes | undefined {
		let command = this.commandHistory.peek()
		if (command !== undefined)
			return this.executeCommand(command)
		return undefined
	}

	public undo() : dto.MoveRes | undefined {
		let command = this.commandHistory.pop()
		if (command !== undefined)
			return command.undo()
		return undefined
	}
}
