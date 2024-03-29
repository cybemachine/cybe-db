"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const fs_1 = __importDefault(require("fs"));
const emitdebugger_1 = __importDefault(require("./emitdebugger"));
const path_1 = require("path");
class DB {
    opt;
    path;
    data = [];
    debugger;
    /**
     * Constructor function
     * @param path path where file should be saved
     * @param options Options
     */
    constructor(path, options) {
        if (!(0, path_1.extname)(path).startsWith("."))
            path = (0, path_1.resolve)(path, "db.json");
        if (!options)
            options = {
                writeonchange: !1,
                humanReadable: !1,
                saveInterval: null,
                debug: !1,
            };
        this.opt = options;
        this.path = (0, path_1.resolve)(path);
        if (options.debug)
            this.debugger = new emitdebugger_1.default((0, path_1.resolve)(process.cwd(), "./file.log"));
        if (fs_1.default.existsSync(this.path))
            this.JSON(JSON.parse(fs_1.default.readFileSync(this.path, "utf-8")));
        else
            fs_1.default.writeFileSync(this.path, "[]");
        this.save();
        if (options.saveInterval)
            setInterval(() => this.save(), this.opt.saveInterval);
    }
    /**
     * save file into the current file path
     */
    save() {
        const self = this;
        const date = new Date();
        const data = this.toString();
        if (this.debugger)
            this.debugger.newdebug("Debug", `Saving ${data}`);
        fs_1.default.writeFile(this.path, data, (Err) => {
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
    has(id) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Finding if ${id} exists`);
        return this.data.some((x) => x.id == id);
    }
    /**
     * get document from database with the given id
     * @param id id to fetch
     */
    get(id) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Fetching ${id}`);
        return this.data.find((x) => x.id == id);
    }
    /**
     * set a id to a given val in db
     * @param id id to save
     * @param val Document to save
     */
    set(id, val) {
        this.data.push(Object.assign(val, {
            id,
        }));
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Set ${id} to ${JSON.stringify(val)}`);
        if (this.opt.writeonchange)
            this.save();
        return this;
    }
    /**
     * deleteAll data in db
     */
    deleteAll() {
        this.data = [];
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Deleting all`);
        if (this.opt.writeonchange)
            this.save();
        return this;
    }
    /**
     * delete a document with the specified id
     * @param id id to delete
     */
    delete(id) {
        this.data = this.data.filter((x) => x.id != id);
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Deleting ${id}`);
        if (this.opt.writeonchange)
            this.save();
        return this;
    }
    /**
     * stringify the db
     */
    toString() {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Converting to string`);
        return this.opt.humanReadable
            ? JSON.stringify(this.data, null, 4)
            : JSON.stringify(this.data);
    }
    /**
     * save/read json from the db
     * @param storage optional way to change the db
     */
    JSON(storage) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", storage ? "returning JSON" : `replacing ${JSON.stringify(this.data)} -> ${JSON.stringify(storage)}`);
        if (!storage)
            return this.data;
        this.data = storage;
        if (this.opt.writeonchange)
            this.save();
        return this.data;
    }
}
exports.DB = DB;
exports.default = DB;
