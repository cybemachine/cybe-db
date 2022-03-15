import Debugger from "./emitdebugger";
export declare class Config {
    writeonchange: boolean;
    humanReadable: boolean;
    saveInterval: number;
    debug: boolean;
    constructor(writeonchange?: boolean, humanReadable?: boolean, saveInterval?: number, debug?: boolean);
}
export declare class DB {
    opt: Config;
    path: string;
    backupdir: string;
    data: Array<{
        id: string;
        [x: string]: any;
        [x: number]: any;
    }>;
    debugger?: Debugger;
    constructor(path?: string, options?: Config);
    save(): this;
    has(id: string): boolean;
    get(id: string): {
        [x: string]: any;
        [x: number]: any;
        id: string;
    };
    set(id: string, val: any): this;
    deleteAll(): this;
    delete(id: string): this;
    toString(): string;
    JSON(storage?: any[]): any[];
}
export default DB;
//# sourceMappingURL=index.d.ts.map