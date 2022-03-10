import fs from "fs";

function validateJSON(o: string) {
    try { JSON.parse(o) } catch (o) { throw new Error("Given filePath is not empty and its content is not valid JSON.") } return !0
};

interface opt {
    asyncWrite?: boolean,
    syncOnWrite?: boolean,
    debug?: boolean,
    spaces?: number
}

export class db {
    path: string;
    options: opt;
    debug: boolean;
    data: object;
    minifed: { clear: () => {}; toString: () => string; has: (id: string) => any; set: (id: string, val: object) => object; delete: (id: string) => boolean; get: (id: string) => any; JSON: (storage: object) => any; };
    has: (id: string) => boolean;
    get: (id: string) => any;
    constructor(r = "./index.json", t: opt) {
        const s = this;
        if (!r) throw new Error("path is not transfered");

        this.data = {};
        this.path = r;
        this.options = Object.assign(t, { debug: !1, spaces: 0, asyncWrite: !1, syncOnWrite: !0 });

        this.minifed = {
            clear: () => s.data = {},
            toString: () => JSON.stringify(s.data),
            has: (i: string) => Reflect.has(s.data, i),
            get: (i: string) => Reflect.get(s.data, i),
            set: (i: string, v: object) => s.data[i] = v,
            JSON: (t: object) => t ? s.data = t : s.data,
            delete: (i: string) => Reflect.deleteProperty(s.data, i)
        }

        this.has = (id: string) => Reflect.has(s.data, id);
        this.get = (id: string) => Reflect.get(s.data, id);
        this.toString = () => JSON.stringify(this.data, null, this.options.spaces);

        fs.stat(r, (t, e) => {
            if (t) switch (t.code) {
                case "ENOENT": return;
                case "EACCES": throw new Error(`Cannot access path "${r}".`);
                default: throw new Error(`Error while checking for existence of path "${r}": ${t}`)
            }
            fs.access(r, fs.constants.R_OK | fs.constants.W_OK, t => {
                if (t) throw new Error(`Cannot read & write on path "${r}". Check permissions!`);
                e.size < 0 || fs.readFile(r, "utf-8", (t, e) => {
                    if (t) throw new Error(`Error while reading file "${r}": ${t}`); s.data = validateJSON(e) ? JSON.parse(e) : {}
                })
            })
        })
    }

    set(id: string, val: any) {
        Reflect.set(this.data, id, val);
        this.options.syncOnWrite && this.sync();
        return this;
    }

    delete(id: string) {
        Reflect.deleteProperty(this.data, id);
        this.options.syncOnWrite && this.sync();
        return this;
    }

    clear() {
        this.data = {};
        return this;
    }

    sync() {
        const i = this.path;
        const t = JSON.stringify(this.data, null, this.options.spaces);

        if (!this.options.asyncWrite) try {
            return fs.writeFileSync(i, t), this
        } catch (t) {
            return "EACCES" !== t.code ? (console.error(`Error while writing to path "${i}": ${t}`), this) : (console.error(`Cannot access path "${i}".`), this)
        };

        return fs.writeFile(i, t, t => { t && console.error(t) }), this
    }

    JSON(storage?: object) {
        if (!storage) return JSON.parse(JSON.stringify(this.data));
        this.data = JSON.parse(JSON.stringify(storage));
    }
}

export default db