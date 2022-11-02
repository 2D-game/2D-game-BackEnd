import { ICommand } from "./ICommand";
import { MoveCommand } from "./MoveCommand";

export class CommandHistory {
    history: ICommand[]
    constructor() {
        this.history = []
    }

    push(command: ICommand) {
        this.history.push(command)
    }

    pop() : ICommand | undefined {
        return this.history.pop()
    }

    peek() : ICommand | undefined {
        return this.history.at(-1)
    }

    clear() {
        this.history = []
    }
}