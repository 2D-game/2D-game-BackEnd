import { PlayerColor } from './Usecase'

export interface IUsecase {
	getUnusedColor(used: PlayerColor[]): PlayerColor

	getImage(color: PlayerColor): Promise<string>
}
