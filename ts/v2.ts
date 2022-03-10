import fs from "fs";
import Chance from 'chance';
import AdmZip from "adm-zip";
import EventEmitter from "events";
import { resolve, sep, dirname, extname } from "path";

export interface DBopt {
    writeonchange?: boolean,
    spaces?: number,
    saveInterval?: number
}

export type DBval = {
    [x: string]: any;
    [x: number]: any;
}

function mkdir(path: string) {
    const dirs = path.split(sep);
    return new Promise((r, j) => {
        dirs.forEach((dir, i) => {
            let p = dirs.slice(0, i + 1).join(sep);
            if (!fs.existsSync(p)) fs.mkdirSync(p);
            if (i == dirs.length - 1) r(void 0);
        });
    })
}

function zip(backup: string, backupdir: string[]) {
    var zip = new AdmZip();
    backupdir.forEach((f, i) => {
        const file = resolve(backup, f);
        zip.addLocalFile(file);
        fs.rmSync(file);
        if (i == backupdir.length - 1) zip.writeZip(resolve(backup, `${Date.now()}.zip`));
    });
}

class EventDB extends EventEmitter {
    file: string;
    opt: Config;
    #data: any[];

    constructor(path: string, options: Config) {
        super();
        this.#data = [];
        this.file = path;
        this.opt = options;
    }

    save() {
        const self = this;
        const data = this.toString();

        this.opt.debug && this.emit("debug", `Saving ${data}`);

        fs.writeFile(this.file, data, "utf-8", t => {
            t && self.emit("error", t)
        });
    }

    has(id: string) {
        this.opt.debug && this.emit("debug", `Finding if ${id} exists`);

        return this.#data.some(x => x.id == id);
    }

    get(id: string) {
        this.opt.debug && this.emit("debug", `Fetching ${id}`);

        return this.#data.find(x => x.id == id);
    }

    set(id = new Chance().guid(), val: object) {
        this.#data.push({ id, ...val });

        this.opt.debug && this.emit("debug", `Setting ${id} to ${val}`);
        this.opt.writeonchange && this.save();
    }

    deleteAll() {
        this.#data = [];

        this.opt.debug && this.emit("debug", `Deleting all`);
        this.opt.writeonchange && this.save();
    }

    delete(id: string) {
        this.#data = this.#data.filter(x => x.id != id);

        this.opt.debug && this.emit("debug", `Deleting ${id}`);
        this.opt.writeonchange && this.save();
    }

    toString() {
        return this.opt.humanReadable ? JSON.stringify(this.#data, null, 4) : JSON.stringify(this.#data)
    }

    JSON(storage?) {
        return storage ? this.#data = storage : this.#data;
    }
};

export class Config {
    writeonchange: boolean;
    humanReadable: boolean;
    saveInterval: number;
    debug: boolean;
    constructor(writeonchange?: boolean, humanReadable?: boolean, saveInterval?: number, debug?: boolean) {
        Object.assign(this, Object.assign({ writeonchange, humanReadable, saveInterval, debug }, { writeonchange: !1, humanReadable: !1, saveInterval: null, debug: !1 }));
    }
}

export class DB {
    #skeleton: EventDB;
    opt: Config;
    path: string;
    backupdir: string;

    constructor(path: string = './index.json', options: Config = new Config()) {
        if (!extname(path).startsWith('.')) path = resolve(path, 'db.json');

        this.path = path;
        this.opt = options;
        this.backupdir = resolve(dirname(path), './backup');
        this.#skeleton = new EventDB(path, options);

        options.debug && this.#skeleton.on("debug", (...args) => console.debug(...args));
        fs.existsSync(this.path) && this.#skeleton.JSON(JSON.parse(fs.readFileSync(this.path, "utf-8")));

        this.save();
        this.opt.saveInterval && setInterval(() => this.save(), this.opt.saveInterval);

        for (const id in this.#skeleton) {
            if (Object.prototype.hasOwnProperty.call(this.#skeleton, id)) {
                const element = this.#skeleton[id];
                if (!this[element]) this[element] = this.#skeleton[id];
            }
        }
    }

    save() {
        const files = fs.readdirSync(this.backupdir);
        const date = new Date;
        const datestr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        fs.copyFileSync(this.path, resolve(this.backupdir, `${datestr}.json`));
        if (files.length >= 3) zip(this.backupdir, files);
        this.#skeleton.save();
    }
};

export default DB;