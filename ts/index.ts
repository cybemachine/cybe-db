import {
    readFileSync,
    writeFileSync,
    writeFile,
    stat,
    access,
    constants,
    Stats
} from "fs";

interface optionsdb {
    asyncWrite?: boolean,
    syncOnWrite?: boolean,
    jsonSpaces?: number,
    debug?: boolean
}

function validateJSON(FC: string) {
    try {
        JSON.parse(FC);
    } catch (e) {
        throw new Error('Given filePath is not empty and its content is not valid JSON.');
    }
    return true;
}

var logSync = (...args: any[]) => {
    try {
        args = args.map((arg) => JSON.parse(JSON.stringify(arg)));
        console.log(...args);
    } catch (error) {
        console.log(`Error trying to console.logSync(${args})`);
    }
}

export default class db {
    ext: string;
    path: string;
    data: object;
    debug: boolean;
    options: optionsdb;
    constructor(path: string = "./index.json", options: optionsdb = {
        asyncWrite: false,
        syncOnWrite: true,
        jsonSpaces: 0,
        debug: false
    }) {
        var self: db = this;

        this.data = {};
        this.path = path;
        this.options.debug = options.debug;
        this.options.jsonSpaces = options.jsonSpaces;
        this.options.asyncWrite = options.asyncWrite;
        this.options.syncOnWrite = options.syncOnWrite;

        (async () => {
            let stats: Stats;

            stats = await new Promise((r, j) => {
                stat(path, (err, sta) => {
                    r(sta);
                    switch (err.code) {
                        case 'ENOENT':
                            return;

                        case 'EACCES':
                            throw new Error(`Cannot access path "${path}".`);

                        default:
                            throw new Error(`Error while checking for existence of path "${path}": ${err}`);
                    }
                })
            })

            access(path, constants.R_OK | constants.W_OK, (err) => {
                if (err) throw new Error(`Cannot read & write on path "${path}". Check permissions!`)
            })

            if (stats.size < 0) return;

            try {
                var data = readFileSync(path, 'utf-8');
                self.data = validateJSON(data) ? JSON.parse(data) : undefined
            } catch (err) {
                throw err;
            }
        })();
    }

    has(id: string) {
        this.debug ? logSync(`Function has: initiated with id:${id}`) : null
        return this.data.hasOwnProperty(id);
    }

    get(id: string) {
        this.debug ? logSync(`Function get: initiated with id:${id}`) : null
        return this.data.hasOwnProperty(id) ? this.data[id] : undefined
    }

    set(id: string, val: any) {
        this.debug ? logSync(`Function set: initiated with id:${id} and val:${val}`) : null

        this.data[id] = val;

        if (this.options.syncOnWrite) this.sync();
        return this;
    }

    delete(id: string) {
        this.data[id] = undefined;
        this.debug ? logSync(`Function delete: initiated with id:${id}`, `Function delete: removed id:${id}`) : null

        this.data = this.data.hasOwnProperty(id) ? JSON.parse(JSON.stringify(this.data)) : undefined;

        if (this.options.syncOnWrite) this.sync();

        return this;
    }

    deleteAll() {
        this.debug ? logSync('Function deleteall: initiated') : null
        this.data = {};
        return this;
    }

    sync() {
        this.debug ? logSync('Function sync: initiated') : null

        if (!this.options.asyncWrite) {
            try {
                writeFileSync(this.path, JSON.stringify(this.data, null, this.options.jsonSpaces));
                return this;
            } catch (err) {
                if (err.code !== 'EACCES') {
                    console.error(`Error while writing to path "${this.path}": ${err}`);
                    return this;
                };

                console.error(`Cannot access path "${this.path}".`);
                return this;
            };
        }

        writeFile(this.path, JSON.stringify(this.data, null, this.options.jsonSpaces), (err) => {
            if (err) console.error(err);;
        });

        return this;
    }

    JSON(storage?: object) {
        this.debug ? logSync(`Function JSON: ${storage ? `changing ${this.data} into ${storage}` : `fetchhing data`}`) : null

        if (!storage) return JSON.parse(JSON.stringify(this.data));

        this.data = JSON.parse(JSON.stringify(storage));
    }
}

//177