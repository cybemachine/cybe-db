import FileMan from './fileman';
import Debugger from "./emitdebugger";
export interface Opts {
    debug: boolean;
    filename: string;
    readFile: boolean;
    inMemoryOnly: boolean;
    timestampData: boolean;
}
export interface DBStore {
    _id: string;
}
export declare class DB<T extends DBStore> {
    debug: Debugger;
    db: T[];
    file: FileMan<T>;
    constructor(options: Partial<Opts> | string);
    insert(doc: T): string;
    find(doc: Partial<T>): T[];
    findIndex(doc: Partial<T>): number[];
    count(doc: Partial<T>): number;
    update(doc: T, updated: T): number;
    delete(doc: T): number;
    get length(): number;
}
export default DB;
