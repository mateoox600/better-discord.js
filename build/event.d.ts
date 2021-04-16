export declare class Event {
    name: string;
    execute: (...args: any[]) => void;
    constructor(name: string, execute: (...args: any[]) => void);
}
