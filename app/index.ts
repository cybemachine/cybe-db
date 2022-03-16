import fs from "fs";
import Chance from 'chance';
import AdmZip from "adm-zip";
import Debugger from "./emitdebugger";
import { resolve, sep, extname } from "path";

function mkdir(path: string) {
    const dirs = path.split(sep);
    return new Promise<number>((r, j) => {
        const length = dirs.length;
        for (var i = 0; i < length; i++) {
            let p = dirs.slice(0, i + 1).join(sep);
            fs.existsSync(p) || fs.mkdirSync(p);
            i == dirs.length - 1 && r(0);
        }
    })
}

function zip(backup: string, backupdir: string[]) {
    //@ts-ignore
    var zip = new AdmZip();
    backupdir.forEach((f, i) => {
        const file = resolve(backup, f);
        zip.addLocalFile(file);
        fs.rmSync(file);
        if (i == backupdir.length - 1) zip.writeZip(resolve(backup, `${Date.now()}.zip`));
    });
}

interface Config {
    writeonchange?: boolean,
    humanReadable?: boolean,
    saveInterval?: number,
    debug?: boolean
}

export class DB {
    opt: Config;
    path: string;
    backupdir: string;
    data: Array<{ id: string, [x: string]: any, [x: number]: any }> = [];
    debugger?: Debugger;

    constructor(path: string = './index.json', options: Config = {
        writeonchange: !1,
        humanReadable: !1,
        saveInterval: null,
        debug: !1
    }) {
        if (!extname(path).startsWith('.'))
            path = resolve(path, 'db.json');

        this.opt = Object.assign(options, { writeonchange: !1, humanReadable: !1, saveInterval: null, debug: !1 })

        this.path = resolve(path);
        this.backupdir = resolve(path, '../backup');

        mkdir(this.backupdir)

        if (options.debug) this.debugger = new Debugger(resolve(this.backupdir, './debug.json'));

        if (fs.existsSync(this.path)) { this.JSON(JSON.parse(fs.readFileSync(this.path, "utf-8"))); } else { fs.writeFileSync(this.path, '[]'); }

        this.save();

        if (options.saveInterval) setInterval(() => this.save(), this.opt.saveInterval);
    }

    save() {
        const self = this;
        const date = new Date;
        const data = this.toString();
        const files = fs.readdirSync(this.backupdir);

        fs.copyFileSync(this.path,
            resolve(this.backupdir, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`)
        );

        if (files.length >= 3) zip(this.backupdir, files);

        if (this.debugger) this.debugger.newdebug("Debug", `Saving ${data}`);

        fs.writeFile(this.path, data, Err => {
            if (Err && self.debugger) self.debugger.newdebug("Error", JSON.stringify(Err))
        });

        return this;
    }

    has(id: string) {
        if (this.opt.debug) this.debugger.newdebug("Debug", `Finding if ${id} exists`);

        return this.data.some(x => x.id == id);
    }

    get(id: string) {
        if (this.opt.debug) this.debugger.newdebug("Debug", `Fetching ${id}`);

        return this.data.find(x => x.id == id);
    }

    set(id = new Chance().guid(), val: any) {
        this.data.push({ id, val });

        if (this.opt.debug) this.debugger.newdebug("Debug", `Setting ${id} to ${val}`);
        if (this.opt.writeonchange) this.save();

        return this;
    }

    deleteAll() {
        this.data = [];

        if (this.opt.debug) this.debugger.newdebug("Debug", `Deleting all`);
        if (this.opt.writeonchange) this.save();

        return this;
    }

    delete(id: string) {
        this.data = this.data.filter(x => x.id != id);

        if (this.opt.debug) this.debugger.newdebug("Debug", `Deleting ${id}`);
        if (this.opt.writeonchange) this.save();

        return this;
    }

    toString() {
        if (this.opt.debug) this.debugger.newdebug("Debug", `Converting to string`);

        return this.opt.humanReadable ? JSON.stringify(this.data, null, 4) : JSON.stringify(this.data);
    }

    JSON(storage?: any[]) {
        if (this.opt.debug) this.debugger.newdebug("Debug", storage ? 'returning JSON' : `replacing ${this.data} -> ${storage}`);

        if (!storage) return this.data;
        return this.data = storage;
    }
};

export default DB;