import fs from 'fs';

export default class Debugger {
    file: string;
    data: string[] = []
    constructor(file = `${process.cwd()}/debug.json`) {
        const self: Debugger = this;
        this.file = file;

        setInterval(() => {
            self.data || (self.data = []);

            if (self.data.length >= 17) this.save();
        }, 1000)
    }

    save() {
        if (this.data.length < 17) return;

        const data = this.data.join('');
        this.data = [];

        fs.writeFileSync(this.file, data);
    }

    newdebug(method: 'Error' | 'Debug', data: string) {
        this.data.push(`${new Date} ${method} ${data}\n`);
    }
}