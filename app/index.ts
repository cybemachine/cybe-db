import fs from "fs";
import { randomUUID } from "crypto";
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
  });
}

export interface Config {
  writeonchange?: boolean;
  humanReadable?: boolean;
  saveInterval?: number;
  debug?: boolean;
}

export type Innerdata<A> = A & { id: string };

export class DB<T> {
  opt: Config;
  path: string;
  backupdir: string;
  data: Innerdata<T>[] = [];
  debugger?: Debugger;

  /**
   * Constructor function
   * @param path path where file should be saved
   * @param options Options
   */
  constructor(
    path: string,
    options: Config = {
      writeonchange: !1,
      humanReadable: !1,
      saveInterval: null,
      debug: !1,
    }
  ) {
    if (!extname(path).startsWith(".")) path = resolve(path, "db.json");

    this.opt = Object.assign(options, {
      writeonchange: !1,
      humanReadable: !1,
      saveInterval: null,
      debug: !1,
    });

    this.path = resolve(path);
    this.backupdir = resolve(path, "../backup");

    mkdir(this.backupdir);

    if (options.debug)
      this.debugger = new Debugger(resolve(this.backupdir, "./debug.json"));

    if (fs.existsSync(this.path)) {
      this.JSON(JSON.parse(fs.readFileSync(this.path, "utf-8")));
    } else {
      fs.writeFileSync(this.path, "[]");
    }

    this.save();

    if (options.saveInterval)
      setInterval(() => this.save(), this.opt.saveInterval);
  }

  /**
   * save file into both backupdir and the current file path
   */
  save() {
    const self = this;
    const date = new Date();
    const data = this.toString();
    const backupfile = resolve(
      this.backupdir,
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`
    );

    fs.copyFileSync(this.path, backupfile);

    if (this.debugger) this.debugger.newdebug("Debug", `Saving ${data}`);

    fs.writeFile(this.path, data, (Err) => {
      if (Err && self.debugger)
        self.debugger.newdebug("Error", JSON.stringify(Err));
    });

    return this;
  }

  /**
   * check if the db has a id
   * @param id id to check
   * @returns {boolean} boolean indicating if id exists
   */
  has(id: string): boolean {
    if (this.opt.debug)
      this.debugger.newdebug("Debug", `Finding if ${id} exists`);

    return this.data.some((x) => x.id == id);
  }

  /**
   * get document from database with the given id
   * @param id id to fetch
   */
  get(id: string) {
    if (this.opt.debug) this.debugger.newdebug("Debug", `Fetching ${id}`);

    return this.data.find((x) => x.id == id);
  }

  /**
   * set a id to a given val in db
   * @param id id to save
   * @param val Document to save
   */
  set(id = randomUUID(), val: T) {
    this.data.push(
      Object.assign(val, {
        id,
      })
    );

    if (this.opt.debug)
      this.debugger.newdebug("Debug", `Setting ${id} to ${val}`);
    if (this.opt.writeonchange) this.save();

    return this;
  }

  /**
   * deleteAll data in db
   */
  deleteAll() {
    this.data = [];

    if (this.opt.debug) this.debugger.newdebug("Debug", `Deleting all`);
    if (this.opt.writeonchange) this.save();

    return this;
  }

  /**
   * delete a document with the specified id
   * @param id id to delete
   */
  delete(id: string) {
    this.data = this.data.filter((x) => x.id != id);

    if (this.opt.debug) this.debugger.newdebug("Debug", `Deleting ${id}`);
    if (this.opt.writeonchange) this.save();

    return this;
  }

  /**
   * stringify the db
   */
  toString() {
    if (this.opt.debug) this.debugger.newdebug("Debug", `Converting to string`);

    return this.opt.humanReadable
      ? JSON.stringify(this.data, null, 4)
      : JSON.stringify(this.data);
  }

  /**
   * save/read json from the db
   * @param storage optional way to change the db
   */
  JSON(storage?: Innerdata<T>[]) {
    if (this.opt.debug)
      this.debugger.newdebug(
        "Debug",
        storage ? "returning JSON" : `replacing ${this.data} -> ${storage}`
      );

    if (!storage) return this.data;
    this.data = storage;
    if (this.opt.writeonchange) this.save();
    return this.data;
  }
}

export default DB;
