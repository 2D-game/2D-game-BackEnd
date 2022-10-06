export type Callback<Type> = (t: Type) => void

export interface IObserver {
	start(): void
	stop(): void
}

export abstract class IPublisher<EType, DType> {
	private readonly events: Map<EType, Set<Callback<DType>>>

	protected constructor() {
		this.events = new Map()
	}

	subscribe(event: EType, c: Callback<DType>) {
		const subs = this.events.get(event)
		if (subs === undefined) {
			this.events.set(event, new Set([c]))
			return
		}
		subs.add(c)
	}

	unsubscribe(event: EType, c: Callback<DType>) {
		const subs = this.events.get(event)
		if (subs !== undefined) {
			subs.delete(c)
		}
	}

	publish(event: EType, data: DType) {
		const subs = this.events.get(event)
		if (subs !== undefined) {
			subs.forEach((c) => c(data))
		}
	}
}
