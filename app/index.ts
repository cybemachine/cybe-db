import FileMan from './fileman';
import { resolve } from "path";
import Debugger from "./emitdebugger";
import { randomUUID } from "crypto";

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

const defaultOpts: Partial<Opts> = {
  debug: false,
  readFile: true,
  inMemoryOnly: false,
  timestampData: true
}

export class DB<T extends DBStore> {
  debug: Debugger;
  db: T[];
  file: FileMan<T>;
  constructor(options: Partial<Opts> | string) {
    if (typeof options == "string") options = { filename: options };

    options = Object.assign(defaultOpts, options);

    if (options.filename && options.inMemoryOnly) {
      console.warn("Cannot use options.filename with options.inMemoryOnly");
      options.inMemoryOnly = false;
    };

    if (options.inMemoryOnly && options.debug) {
      console.warn("Cannot use options.debug and options.inMemoryOnly options in DB");
      options.debug = false;
    };

    if (options.debug) {
      this.debug = new Debugger(options.filename ? resolve(options.filename, "./debug.log") : resolve(__dirname, "./debug.log"), options.inMemoryOnly);
    };

    if (options.inMemoryOnly !== true) {
      this.file = new FileMan<T>(options.filename, {
        readInitFile: options.readFile
      });
    }

    this.db = [];
  }

  insert(doc: T) {
    const toInsert: T = Object.assign({
      _id: randomUUID()
    }, doc);
    if (this.debug) this.debug.newdebug("Debug", "Inserting document with id " + toInsert._id)
    this.db.push(toInsert);
    if (this.file) this.file.append(toInsert);
    return toInsert._id;
  };

  find(doc: Partial<T>) {
    if (this.debug) this.debug.newdebug("Debug", "Finding using " + doc)
    let currentDB = this.db;
    for (let i = 0, dockeys = Object.keys(doc); i < dockeys.length; i++) {
      const key = dockeys[i];
      const search = (doc[key]);
      currentDB = currentDB.filter((v) => {
        if (Reflect.has(v, key) && search == v[key]) {
          return true;
        };
        return false;
      })
    }
    return currentDB;
  }

  findIndex(doc: Partial<T>) {
    const listOfIndexes: number[] = [];
    let currentDB = this.db;
    for (let i = 0, dockeys = Object.keys(doc); i < dockeys.length; i++) {
      const key = dockeys[i];
      currentDB.forEach((v, i) => {
        if (Reflect.has(v, key) && doc[key] == v[key]) {
          listOfIndexes.push(i);
        };
      });
    }
    return listOfIndexes;
  }

  count(doc: Partial<T>) {
    if (this.debug) this.debug.newdebug("Debug", "Counting using " + doc);
    let count = 0;
    for (let i = 0, dockeys = Object.keys(doc); i < dockeys.length; i++) {
      const key = dockeys[i];
      this.db.forEach((v) => {
        if (Reflect.has(v, key) && doc[key] == v[key]) count++
      })
    }
    return count;
  }

  update(doc: T, updated: T) {
    const self = this;
    let numAffected = 0;

    const searched = this.findIndex(doc);
    const updatedKeys = Object.keys(updated);

    for (let i = 0; i < searched.length; i++) {
      const index = searched[i];
      numAffected++;
      for (let i = 0; i < updatedKeys.length; i++) {
        const key = updatedKeys[i];
        if (key == 'prototype' || key == '__proto__') {
          self.debug.newdebug("Debug", "Cannot update prototype");
          continue;
        }
        self.db[index][key] = updated[key];
      }
    }

    return numAffected;
  }

  delete(doc: T) {
    const self = this;
    let numAffected = 0;
    const searched = this.findIndex(doc);
    for (let i = 0; i < self.length; i++) {
      numAffected++;
      self.db.splice(searched[i], 1);
    }
    return numAffected;
  }

  get length() {
    return this.db.length
  }
}

export default DB;
