import { Coordinates } from "../../map";

export interface ICommand{
    coordinates : Coordinates
    undo(): Coordinates;
}