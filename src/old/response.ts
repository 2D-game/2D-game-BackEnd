// export type Error = {
// 	message: string
// }
//
// export type Res<Type> = {
// 	error: Error | null
// 	data: Type | null
// }
//
// export function newError(message: string): Res<null> {
// 	return {
// 		error: { message: message },
// 		data: null
// 	}
// }
//
// export function newRes<Type>(data: Type): Res<Type> {
// 	return {
// 		error: null,
// 		data: data
// 	}
// }
