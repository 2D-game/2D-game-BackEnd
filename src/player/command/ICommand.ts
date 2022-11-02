import { Coordinates } from "../../map";
import { Direction } from "../dto";
import { Player } from "../Player";
import { Usecase as PlayerUsecase } from '../.'
import * as dto from '../'

export interface ICommand {
    playerUcase: PlayerUsecase
    direction : Direction
    coordinates : Coordinates
    player : Player

    execute(): dto.MoveRes;
    undo(): dto.MoveRes;
}