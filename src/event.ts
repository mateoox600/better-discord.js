
export class Event {
    constructor(public name: string, public execute: (...args: any[]) => void) { }
}