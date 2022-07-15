"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Debugger {
    file;
    data;
    constructor(file = `./file.log`) {
        this.file = file;
        this.data = [];
    }
    save() {
        fs_1.default.appendFileSync(this.file, this.data.join("\n"));
        this.data = [];
    }
    newdebug(method, data) {
        this.data.push(`${new Date()} ${method} ${data}`);
        if (this.data.length >= 50)
            this.save();
    }
}
exports.default = Debugger;
