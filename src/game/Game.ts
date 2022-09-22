import { Map } from "../map";

export class Game {
	private readonly map: Map

	constructor(map: Map) {
		this.map = map
	}

	getMap(): Map {
		return this.map
	}
}
