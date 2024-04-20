import FileMan from "./fileman";
export default class Debugger {
    file: FileMan<string[]>;
    data: string[];
    inmem: boolean;
    constructor(file?: string, inMemoryOnly?: boolean);
    save(): void;
    newdebug(method: "Error" | "Debug", data: string): void;
}
