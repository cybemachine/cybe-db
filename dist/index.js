import fs from "fs";
import Chance from 'chance';
import AdmZip from "adm-zip";
import Debugger from "./emitdebugger";
import { resolve, sep, extname } from "path";
function mkdir(path) {
    const dirs = path.split(sep);
    return new Promise((r, j) => {
        const length = dirs.length;
        for (var i = 0; i < length; i++) {
            let p = dirs.slice(0, i + 1).join(sep);
            fs.existsSync(p) || fs.mkdirSync(p);
            i == dirs.length - 1 && r(0);
        }
    });
}
function zip(backup, backupdir) {
    //@ts-ignore
    var zip = new AdmZip();
    backupdir.forEach((f, i) => {
        const file = resolve(backup, f);
        zip.addLocalFile(file);
        fs.rmSync(file);
        if (i == backupdir.length - 1)
            zip.writeZip(resolve(backup, `${Date.now()}.zip`));
    });
}
export class DB {
    opt;
    path;
    backupdir;
    data = [];
    debugger;
    constructor(path = './index.json', options = {
        writeonchange: !1,
        humanReadable: !1,
        saveInterval: null,
        debug: !1
    }) {
        if (!extname(path).startsWith('.'))
            path = resolve(path, 'db.json');
        this.opt = Object.assign(options, { writeonchange: !1, humanReadable: !1, saveInterval: null, debug: !1 });
        this.path = resolve(path);
        this.backupdir = resolve(path, '../backup');
        mkdir(this.backupdir);
        if (options.debug)
            this.debugger = new Debugger(resolve(this.backupdir, './debug.json'));
        if (fs.existsSync(this.path)) {
            this.JSON(JSON.parse(fs.readFileSync(this.path, "utf-8")));
        }
        else {
            fs.writeFileSync(this.path, '[]');
        }
        this.save();
        if (options.saveInterval)
            setInterval(() => this.save(), this.opt.saveInterval);
    }
    save() {
        const self = this;
        const date = new Date;
        const data = this.toString();
        const files = fs.readdirSync(this.backupdir);
        fs.copyFileSync(this.path, resolve(this.backupdir, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`));
        if (files.length >= 3)
            zip(this.backupdir, files);
        if (this.debugger)
            this.debugger.newdebug("Debug", `Saving ${data}`);
        fs.writeFile(this.path, data, Err => {
            if (Err && self.debugger)
                self.debugger.newdebug("Error", JSON.stringify(Err));
        });
        return this;
    }
    has(id) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Finding if ${id} exists`);
        return this.data.some(x => x.id == id);
    }
    get(id) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Fetching ${id}`);
        return this.data.find(x => x.id == id);
    }
    set(id = new Chance().guid(), val) {
        this.data.push({ id, val });
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Setting ${id} to ${val}`);
        if (this.opt.writeonchange)
            this.save();
        return this;
    }
    deleteAll() {
        this.data = [];
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Deleting all`);
        if (this.opt.writeonchange)
            this.save();
        return this;
    }
    delete(id) {
        this.data = this.data.filter(x => x.id != id);
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Deleting ${id}`);
        if (this.opt.writeonchange)
            this.save();
        return this;
    }
    toString() {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", `Converting to string`);
        return this.opt.humanReadable ? JSON.stringify(this.data, null, 4) : JSON.stringify(this.data);
    }
    JSON(storage) {
        if (this.opt.debug)
            this.debugger.newdebug("Debug", storage ? 'returning JSON' : `replacing ${this.data} -> ${storage}`);
        if (!storage)
            return this.data;
        return this.data = storage;
    }
}
;
export default DB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9hcHAvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLE1BQU0sTUFBTSxTQUFTLENBQUM7QUFDN0IsT0FBTyxRQUFRLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVcsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXRELFNBQVMsS0FBSyxDQUFDLElBQVk7SUFDdkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixPQUFPLElBQUksT0FBTyxDQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsU0FBUyxHQUFHLENBQUMsTUFBYyxFQUFFLFNBQW1CO0lBQzVDLFlBQVk7SUFDWixJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0lBQ3ZCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVNELE1BQU0sT0FBTyxFQUFFO0lBQ1gsR0FBRyxDQUFTO0lBQ1osSUFBSSxDQUFTO0lBQ2IsU0FBUyxDQUFTO0lBQ2xCLElBQUksR0FBOEQsRUFBRSxDQUFDO0lBQ3JFLFFBQVEsQ0FBWTtJQUVwQixZQUFZLE9BQWUsY0FBYyxFQUFFLFVBQWtCO1FBQ3pELGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDakIsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUNqQixZQUFZLEVBQUUsSUFBSTtRQUNsQixLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ1o7UUFDRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7WUFDOUIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRTFHLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUU1QyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBRXJCLElBQUksT0FBTyxDQUFDLEtBQUs7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFFekYsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQUU7YUFBTTtZQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUFFO1FBRXpJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVaLElBQUksT0FBTyxDQUFDLFlBQVk7WUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELElBQUk7UUFDQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUM7UUFDdEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUNqRyxDQUFDO1FBRUYsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsRCxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUVyRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsR0FBRyxDQUFDLEVBQVU7UUFDVixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFL0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELEdBQUcsQ0FBQyxFQUFVO1FBQ1YsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUs7WUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXRFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBUTtRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTVCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDL0UsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWE7WUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFeEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVmLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3BFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhO1lBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXhDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNLENBQUMsRUFBVTtRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTlDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN0RSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYTtZQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV4QyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFFNUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFlO1FBQ2hCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksT0FBTyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXpILElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7SUFDL0IsQ0FBQztDQUNKO0FBQUEsQ0FBQztBQUVGLGVBQWUsRUFBRSxDQUFDIn0=