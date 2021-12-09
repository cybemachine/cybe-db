interface optionsdb {
    asyncWrite?: boolean;
    syncOnWrite?: boolean;
    jsonSpaces?: number;
    debug?: boolean;
}
export default class db {
    ext: string;
    path: string;
    data: object;
    debug: boolean;
    options: optionsdb;
    constructor(path?: string, options?: optionsdb);
    has(id: string): boolean;
    get(id: string): any;
    set(id: string, val: any): this;
    delete(id: string): this;
    deleteAll(): this;
    sync(): this;
    JSON(storage?: object): any;
}
export {};
//# sourceMappingURL=index.d.ts.map