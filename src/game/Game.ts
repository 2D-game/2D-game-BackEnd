const ErrGameAlreadyStarted = 'Game already started';

export class Game {
	private started: boolean

	constructor() {
		this.started = false
	}

	start() {
		if (this.started) {
			throw new Error(ErrGameAlreadyStarted)
		}
		this.started = true
	}
}
