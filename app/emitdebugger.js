"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileman_1 = __importDefault(require("./fileman"));
class Debugger {
    file;
    data;
    inmem;
    constructor(file = `./file.log`, inMemoryOnly = false) {
        this.inmem = inMemoryOnly;
        if (!inMemoryOnly)
            this.file = new fileman_1.default(file, {
                'readInitFile': false
            });
        this.data = [];
    }
    save() {
        if (this.inmem)
            return;
        this.file.append(this.data);
        this.data = [];
    }
    newdebug(method, data) {
        this.data.push(`${new Date()} ${method} ${data}`);
        if (this.inmem) {
            console[method == "Error" ? "error" : "debug"](this.data.pop());
            return;
        }
        if (this.data.length >= 50)
            this.save();
    }
}
exports.default = Debugger;
