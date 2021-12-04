import * as fs from 'node:fs';
import { resolve } from 'path';

export default class db {
    sep: string;
    data: Array<{
        "date": Date,
        "unix": number,
        "data": any,
        "_id": number
    }>;
    dirname: string;
    constructor(dirname: string) {
        this.data = [];
        this.sep = ";";
        this.dirname = dirname;
        this.load();
    }
    load() {
        return new Promise((r, j) => {
            if (!fs.existsSync(this.dirname)) fs.mkdirSync(this.dirname);
            fs.readdirSync(this.dirname).forEach((file, i, arr) => {
                var file = resolve(this.dirname, file)
                if (fs.lstatSync(file).isDirectory()) return fs.rmdirSync(file);
                var json = JSON.parse(fs.readFileSync(file, 'utf-8'));
                this.data.push(json)
                if (i == arr.length - 1) r(void 0)
            })
        })
    }
    post(data: any) {
        var date = new Date();
        var unix = Math.round(date.getTime() / 1000);

        var obj = {
            "date": date,
            "unix": unix,
            data,
            "_id": Math.random() * 10000000
        };

        fs.writeFileSync(
            resolve(this.dirname, unix.toString()),
            JSON.stringify(obj)
        );

        this.data.push(obj);

        return obj
    }
    get(id: number | string) {
        return this.data.filter((val) => val["_id"] == id)
    }
    delete(id: number | string) {
        this.data.forEach((val, i, arr) => {
            if (val._id !== id) return;

            arr.splice(i, 1);
            var oid = val.unix;

            fs.rmSync(resolve(this.dirname, oid.toString()), {
                "force": true
            });
        })
    }
}