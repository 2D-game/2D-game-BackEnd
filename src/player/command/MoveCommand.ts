import { Coordinates } from "../../map";
import { Direction } from "../dto";
import { Player } from "../Player";
import { ICommand } from "./ICommand";
import { Usecase as PlayerUsecase } from '../.'
import * as dto from '../'

export class MoveCommand implements ICommand {
    playerUcase: PlayerUsecase
    coordinates : Coordinates
    direction: Direction;
    player : Player
    constructor(playerUcase : PlayerUsecase, player : Player, direction : Direction) {
        this.playerUcase = playerUcase;
        this.coordinates = player.getCoords();
        this.player = player;
        this.direction = direction;
    }
    
    execute(): dto.MoveRes {
        return this.playerUcase.move(this.player, this.direction)
    }

    undo(): dto.MoveRes {
        switch (this.direction) {
            case "UP":
                return this.playerUcase.move(this.player, Direction.DOWN)
            case "DOWN":
                return this.playerUcase.move(this.player, Direction.UP)
            case "LEFT":
                return this.playerUcase.move(this.player, Direction.RIGHT)
            default:
                return this.playerUcase.move(this.player, Direction.LEFT)
        }
    }
}