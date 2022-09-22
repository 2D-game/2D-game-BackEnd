export type Callback<Type> = (t: Type) => void

export abstract class EventBus<EType, MType> {
	private readonly events: Map<EType, Set<Callback<MType>>>

	protected constructor() {
		this.events = new Map()
	}

	subscribe(event: EType, callback: Callback<MType>) {
		const fns = this.events.get(event)
		if (fns === undefined) {
			this.events.set(event, new Set([callback]))
			return
		}
		fns.add(callback)
	}

	unsubscribe(event: EType, callback: Callback<MType>) {
		const fns = this.events.get(event)
		if (fns !== undefined) {
			fns.delete(callback)
		}
	}

	publish(event: EType, t: MType) {
		const fns = this.events.get(event)
		if (fns !== undefined) {
			fns.forEach(callback => callback(t))
		}
	}
}
