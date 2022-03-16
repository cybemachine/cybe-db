import fs from 'fs';
export default class Debugger {
    constructor(file = `${process.cwd()}/debug.json`) {
        this.data = [];
        const self = this;
        this.file = file;
        setInterval(() => {
            self.data || (self.data = []);
            if (self.data.length >= 17)
                this.save();
        }, 1000);
    }
    save() {
        if (this.data.length < 17)
            return;
        const data = this.data.join('');
        this.data = [];
        fs.writeFileSync(this.file, data);
    }
    newdebug(method, data) {
        this.data.push(`${new Date} ${method} ${data}\n`);
    }
}
//# sourceMappingURL=emitdebugger.js.map