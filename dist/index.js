"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
var fs_1 = require("fs");
var crypto_1 = require("crypto");
var emitdebugger_1 = require("./emitdebugger");
var path_1 = require("path");
function mkdir(path) {
    var dirs = path.split(path_1.sep);
    return new Promise(function (r, j) {
        var length = dirs.length;
        for (var i = 0; i < length; i++) {
            var p = dirs.slice(0, i + 1).join(path_1.sep);
            fs_1.default.existsSync(p) || fs_1.default.mkdirSync(p);
            i == dirs.length - 1 && r(0);
        }
    });
}
var DB = /** @class */ (function () {
    /**
     * Constructor function
     * @param path path where file should be saved
     * @param options Options
     */
    function DB(path, options) {
        var _this = this;
        if (options === void 0) { options = {
            writeonchange: !1,
            humanReadable: !1,
            saveInterval: null,
            debug: !1,
        }; }
        this.data = [];
        if (!path_1.extname(path).startsWith("."))
            path = path_1.resolve(path, "db.json");
        this.opt = Object.assign(options, {
            writeonchange: !1,
            humanReadable: !1,
            saveInterval: null,
            debug: !1,
        });
        this.path = path_1.resolve(path);
        this.backupdir = path_1.resolve(path, "../backup");
        mkdir(this.backupdir);
        if (options.debug)
            this.debugger = new emitdebugger_1.default(path_1.resolve(this.backupdir, "./debug.json"));
        if (fs_1.default.existsSync(this.path)) {
            this.JSON(JSON.parse(fs_1.default.readFileSync(this.path, "utf-8")));
        }
        else {
            fs_1.default.writeFileSync(this.path, "[]");
        }
        this.save();
        if (options.saveInterval)
            setInterval(function () { return _this.save(); }, this.opt.saveInterval);
    }
    /**
     * save file into both backupdir and the current file path
     */
    DB.prototype.save = function () {
        var self = this;
        var date = new Date();
        var data = this.toString();
        var backupfile = path_1.resolve(this.backupdir, date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ".json");
        fs_1.default.copyFileSync(this.path, backupfile);
        if (this.debugger)
            this.debugger.newdebug("Debug", "Saving " + data);
        fs_1.default.writeFile(this.path, data, function (Err) {
            if (Err && self.debugger)
                self.debugger.newdebug("Error", JSON.stringify(Err));
        });
        return this;
    };
    /**
     * check if the db has a id
     * @param id id to check
     * @returns {boolean} boolean indicating if id exists
     */
    DB.prototype.has = function (id) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", "Finding if " + id + " exists");
        return this.data.some(function (x) { return x.id == id; });
    };
    /**
     * get document from database with the given id
     * @param id id to fetch
     */
    DB.prototype.get = function (id) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", "Fetching " + id);
        return this.data.find(function (x) { return x.id == id; });
    };
    /**
     * set a id to a given val in db
     * @param id id to save
     * @param val Document to save
     */
    DB.prototype.set = function (id, val) {
        if (id === void 0) { id = crypto_1.randomUUID(); }
        this.data.push(Object.assign(val, {
            id: id,
        }));
        if (this.opt.debug)
            this.debugger.newdebug("Debug", "Setting " + id + " to " + val);
        if (this.opt.writeonchange)
            this.save();
        return this;
    };
    /**
     * deleteAll data in db
     */
    DB.prototype.deleteAll = function () {
        this.data = [];
        if (this.opt.debug)
            this.debugger.newdebug("Debug", "Deleting all");
        if (this.opt.writeonchange)
            this.save();
        return this;
    };
    /**
     * delete a document with the specified id
     * @param id id to delete
     */
    DB.prototype.delete = function (id) {
        this.data = this.data.filter(function (x) { return x.id != id; });
        if (this.opt.debug)
            this.debugger.newdebug("Debug", "Deleting " + id);
        if (this.opt.writeonchange)
            this.save();
        return this;
    };
    /**
     * stringify the db
     */
    DB.prototype.toString = function () {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", "Converting to string");
        return this.opt.humanReadable
            ? JSON.stringify(this.data, null, 4)
            : JSON.stringify(this.data);
    };
    /**
     * save/read json from the db
     * @param storage optional way to change the db
     */
    DB.prototype.JSON = function (storage) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", storage ? "returning JSON" : "replacing " + this.data + " -> " + storage);
        if (!storage)
            return this.data;
        this.data = storage;
        if (this.opt.writeonchange)
            this.save();
        return this.data;
    };
    return DB;
}());
exports.DB = DB;
exports.default = DB;
//# sourceMappingURL=index.js.map