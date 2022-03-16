"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Debugger = /** @class */ (function () {
    function Debugger(file) {
        var _this = this;
        if (file === void 0) { file = process.cwd() + "/debug.json"; }
        this.data = [];
        var self = this;
        this.file = file;
        setInterval(function () {
            self.data || (self.data = []);
            if (self.data.length >= 17)
                _this.save();
        }, 1000);
    }
    Debugger.prototype.save = function () {
        if (this.data.length < 17)
            return;
        var data = this.data.join('');
        this.data = [];
        fs_1.default.writeFileSync(this.file, data);
    };
    Debugger.prototype.newdebug = function (method, data) {
        this.data.push(new Date + " " + method + " " + data + "\n");
    };
    return Debugger;
}());
exports.default = Debugger;
//# sourceMappingURL=emitdebugger.js.map