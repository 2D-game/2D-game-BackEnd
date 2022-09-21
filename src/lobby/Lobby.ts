export class Lobby {
	private id: string | null

	constructor() {
		this.id = null
	}

	setID(id: string) {
		this.id = id
	}

	getID(): string {
		if (this.id === null) {
			throw new Error('Lobby ID is not set')
		}
		return this.id
	}
}

