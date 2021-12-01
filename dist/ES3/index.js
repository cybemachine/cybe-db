"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var promise = require("fs/promises");
var fs = require("node:fs");
var node_path_1 = require("node:path");
var db = /** @class */ (function () {
    function db(dirname) {
        this.dirname = dirname;
        this.sep = ";";
        this.load();
    }
    db.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, dirname, sep, filesdir, dirs, file, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = '';
                        _a = this, dirname = _a.dirname, sep = _a.sep;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, promise.readdir(dirname)];
                    case 2:
                        filesdir = _b.sent();
                        dirs = filesdir.filter(function (file) { return fs.lstatSync(node_path_1.resolve(dirname, file)).isDirectory(); });
                        file = filesdir.filter(function (file) { return fs.lstatSync(node_path_1.resolve(dirname, file)).isFile(); });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        ;
                        return [4 /*yield*/, new Promise(function (r, j) {
                                if (!Array.isArray(dirs))
                                    return console.error(dirs);
                                dirs.forEach(function (v, i, arr) {
                                    promise.rmdir(node_path_1.resolve(dirname, v))["catch"](console.error);
                                    if (i == arr.length - 1)
                                        r(0);
                                });
                            })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (r, j) {
                                if (!Array.isArray(file))
                                    return console.error(file);
                                file.forEach(function (v, i, arr) {
                                    var path = node_path_1.resolve(dirname, v);
                                    promise.readFile(path, 'utf-8').then(function (val) {
                                        data += val + "\u001F;\u001F";
                                    })["catch"](console.error);
                                    if (i == arr.length - 1)
                                        r(0);
                                });
                            })];
                    case 6:
                        _b.sent();
                        this.data = data;
                        return [2 /*return*/];
                }
            });
        });
    };
    db.prototype.insert = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, type, _a, out, out;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _b.sent();
                        filename = node_path_1.resolve(this.dirname, (+new Date()).toString());
                        type = typeof data;
                        _a = type;
                        switch (_a) {
                            case "string": return [3 /*break*/, 2];
                            case "number": return [3 /*break*/, 2];
                            case "function": return [3 /*break*/, 2];
                            case "boolean": return [3 /*break*/, 2];
                            case "object": return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        out = "" + data + this.sep;
                        return [4 /*yield*/, promise.writeFile(filename, out)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        out = "" + JSON.stringify(data) + this.sep;
                        return [4 /*yield*/, promise.writeFile(filename, out)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new Error("this type is not allowed");
                    case 7:
                        ;
                        console.log(out);
                        return [2 /*return*/, filename];
                }
            });
        });
    };
    return db;
}());
exports["default"] = db;
//# sourceMappingURL=index.js.map