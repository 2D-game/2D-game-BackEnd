export type Error = {
	message: string
}

export type Res<Type> = {
	error: Error | null
	data: Type | null
}

export function newError<Type>(message: string): Res<Type> {
	return {
		error: { message: message },
		data: null
	}
}
