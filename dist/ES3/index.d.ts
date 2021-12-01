export declare type dataallowed = string | number | boolean | Array<any> | {
    [x: string]: any;
};
export default class db {
    sep: string;
    data: string;
    dirname: string;
    constructor(dirname: string);
    load(): Promise<void>;
    insert(data: dataallowed): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map