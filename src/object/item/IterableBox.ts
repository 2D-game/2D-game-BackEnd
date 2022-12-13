import { Player } from "../../player";
import { Type } from "../IObject";
import { Item } from "./Item";
import { Iterator } from "../../util/Iterator";

export abstract class IterableBox extends Item {
    public abstract getType(): Type;
    public abstract changeScore(player: Player): boolean;
    public abstract spawnNewItem(): boolean;
    public abstract createIterator(): Iterator;
}