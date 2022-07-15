import Debugger from "./emitdebugger";
export interface Config {
    writeonchange?: boolean;
    humanReadable?: boolean;
    saveInterval?: number;
    debug?: boolean;
}
export declare type Innerdata<A> = A & {
    id: string;
};
export declare class DB<T> {
    opt: Config;
    path: string;
    backupdir: string;
    data: Innerdata<T>[];
    debugger?: Debugger;
    /**
     * Constructor function
     * @param path path where file should be saved
     * @param options Options
     */
    constructor(path: string, options?: Config);
    /**
     * save file into both backupdir and the current file path
     */
    save(): this;
    /**
     * check if the db has a id
     * @param id id to check
     * @returns {boolean} boolean indicating if id exists
     */
    has(id: string): boolean;
    /**
     * get document from database with the given id
     * @param id id to fetch
     */
    get(id: string): Innerdata<T>;
    /**
     * set a id to a given val in db
     * @param id id to save
     * @param val Document to save
     */
    set(id: string, val: T): this;
    /**
     * deleteAll data in db
     */
    deleteAll(): this;
    /**
     * delete a document with the specified id
     * @param id id to delete
     */
    delete(id: string): this;
    /**
     * stringify the db
     */
    toString(): string;
    /**
     * save/read json from the db
     * @param storage optional way to change the db
     */
    JSON(storage?: Innerdata<T>[]): Innerdata<T>[];
}
export default DB;
