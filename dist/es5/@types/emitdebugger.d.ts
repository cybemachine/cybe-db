export default class Debugger {
    file: string;
    data: string[];
    constructor(file?: string);
    save(): void;
    newdebug(method: 'Error' | 'Debug', data: string): void;
}
//# sourceMappingURL=emitdebugger.d.ts.map