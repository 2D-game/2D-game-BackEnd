import { IUsecase } from './IUsecase'
import { Image, PlayerColor, Usecase } from './Usecase'

class ImageCache {
	private readonly expires: Date
	private readonly image: Image

	constructor(image: Image, expires: Date) {
		this.image = image
		this.expires = expires
	}

	isExpired(): boolean {
		return this.expires < new Date()
	}

	getImage(): Image {
		return this.image
	}
}

export class ProxyUsecase implements IUsecase {
	private readonly usecase: Usecase
	private readonly imageCache: Map<PlayerColor, ImageCache>
	private readonly cacheTTL: number

	constructor(cacheTTL: number) {
		this.usecase = new Usecase()
		this.imageCache = new Map<PlayerColor, ImageCache>()
		this.cacheTTL = cacheTTL
	}

	getUnusedColor(used: PlayerColor[]): PlayerColor {
		return this.usecase.getUnusedColor(used)
	}

	async getImage(color: PlayerColor): Promise<Image> {
		const cached = this.imageCache.get(color)
		if (cached && !cached.isExpired()) {
			return cached.getImage()
		}
		const image = await this.usecase.getImage(color)
		this.imageCache.set(color, new ImageCache(image, new Date(Date.now() + this.cacheTTL * 1000)))
		return image
	}
}
