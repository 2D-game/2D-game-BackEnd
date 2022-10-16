import { Map } from '../'

export interface IBuilder {
    addWalls(): IBuilder;
    addLava(): IBuilder;
    addWater(): IBuilder;
    build() : Map
}