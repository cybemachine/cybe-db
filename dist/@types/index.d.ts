import Debugger from "./emitdebugger";
export interface Config {
    writeonchange?: boolean;
    humanReadable?: boolean;
    saveInterval?: number;
    debug?: boolean;
}
declare type Innerdata<A> = A & {
    id: string;
};
export declare class DB<T> {
    opt: Config;
    path: string;
    backupdir: string;
    data: Innerdata<T>[];
    debugger?: Debugger;
    constructor(path?: string, options?: Config);
    save(): this;
    has(id: string): boolean;
    get(id: string): Innerdata<T>;
    set(id: string, val: T): this;
    deleteAll(): this;
    delete(id: string): this;
    toString(): string;
    JSON(storage?: Innerdata<T>[]): Innerdata<T>[];
}
export default DB;
//# sourceMappingURL=index.d.ts.map