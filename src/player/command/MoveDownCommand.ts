import { Coordinates } from "../../map";
import { ICommand } from "./ICommand";

export class MoveDownCommand implements ICommand {

    coordinates : Coordinates

    constructor(coords : Coordinates) {
        this.coordinates = coords;
    }

    undo(): Coordinates {
        return {x : this.coordinates.x, y: this.coordinates.y--}
    }
}