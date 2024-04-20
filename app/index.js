"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const fileman_1 = __importDefault(require("./fileman"));
const path_1 = require("path");
const emitdebugger_1 = __importDefault(require("./emitdebugger"));
const crypto_1 = require("crypto");
const defaultOpts = {
    debug: false,
    readFile: true,
    inMemoryOnly: false,
    timestampData: true
};
class DB {
    debug;
    db;
    file;
    constructor(options) {
        if (typeof options == "string")
            options = { filename: options };
        options = Object.assign(defaultOpts, options);
        if (options.filename && options.inMemoryOnly) {
            console.warn("Cannot use options.filename with options.inMemoryOnly");
            options.inMemoryOnly = false;
        }
        ;
        if (options.inMemoryOnly && options.debug) {
            console.warn("Cannot use options.debug and options.inMemoryOnly options in DB");
            options.debug = false;
        }
        ;
        if (options.debug) {
            this.debug = new emitdebugger_1.default(options.filename ? (0, path_1.resolve)(options.filename, "./debug.log") : (0, path_1.resolve)(__dirname, "./debug.log"), options.inMemoryOnly);
        }
        ;
        if (options.inMemoryOnly !== true) {
            this.file = new fileman_1.default(options.filename, {
                readInitFile: options.readFile
            });
        }
        this.db = [];
    }
    insert(doc) {
        const toInsert = Object.assign({
            _id: (0, crypto_1.randomUUID)()
        }, doc);
        if (this.debug)
            this.debug.newdebug("Debug", "Inserting document with id " + toInsert._id);
        this.db.push(toInsert);
        if (this.file)
            this.file.append(toInsert);
        return toInsert._id;
    }
    ;
    find(doc) {
        if (this.debug)
            this.debug.newdebug("Debug", "Finding using " + doc);
        let currentDB = this.db;
        for (let i = 0, dockeys = Object.keys(doc); i < dockeys.length; i++) {
            const key = dockeys[i];
            const search = (doc[key]);
            currentDB = currentDB.filter((v) => {
                if (Reflect.has(v, key) && search == v[key]) {
                    return true;
                }
                ;
                return false;
            });
        }
        return currentDB;
    }
    findIndex(doc) {
        const listOfIndexes = [];
        let currentDB = this.db;
        for (let i = 0, dockeys = Object.keys(doc); i < dockeys.length; i++) {
            const key = dockeys[i];
            currentDB.forEach((v, i) => {
                if (Reflect.has(v, key) && doc[key] == v[key]) {
                    listOfIndexes.push(i);
                }
                ;
            });
        }
        return listOfIndexes;
    }
    count(doc) {
        if (this.debug)
            this.debug.newdebug("Debug", "Counting using " + doc);
        let count = 0;
        for (let i = 0, dockeys = Object.keys(doc); i < dockeys.length; i++) {
            const key = dockeys[i];
            this.db.forEach((v) => {
                if (Reflect.has(v, key) && doc[key] == v[key])
                    count++;
            });
        }
        return count;
    }
    update(doc, updated) {
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
    delete(doc) {
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
        return this.db.length;
    }
}
exports.DB = DB;
exports.default = DB;
