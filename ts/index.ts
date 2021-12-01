import * as promise from 'fs/promises';
import * as fs from 'node:fs';
import { resolve } from 'node:path';

export type dataallowed = string | number | boolean | Function | Array<any> | {
    [x: string]: any;
};

export default class db {
    sep: string;
    data: string;
    dirname: string;
    constructor(dirname: string) {
        this.dirname = dirname;
        this.sep = ";";
    }
    async load() {
        var data = '';
        var { dirname, sep } = this;

        try {
            var filesdir = await promise.readdir(dirname);
            var dirs = filesdir.filter(file => fs.lstatSync(resolve(dirname, file)).isDirectory());
            var file = filesdir.filter(file => fs.lstatSync(resolve(dirname, file)).isFile());
        } catch (e) {
            console.error(e);
        };

        await new Promise((r, j) => {
            if (!Array.isArray(dirs)) return console.error(dirs)
            dirs.forEach((v, i, arr) => {
                promise.rmdir(resolve(dirname, v)).catch(console.error);
                if (i == arr.length - 1) r(0);
            });
        });

        await new Promise((r, j) => {
            if (!Array.isArray(file)) return console.error(file)
            file.forEach((v, i, arr) => {
                var path = resolve(dirname, v);
                promise.readFile(path, 'utf-8').then(val => {
                    data += `${val};`
                }).catch(console.error)
                if (i == arr.length - 1) r(0);
            });
        });

        this.data = data;
    }
    async insert(data: dataallowed) {
        await this.load();
        var date = new Date();
        var sep = this.sep;

        var str = {
            val: '',
            push: (...args) => {
                args.forEach(val => {
                    str.val += val;
                    str.val += sep;
                })
            }
        };

        str.push(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
        str.val += '.cybe';

        var file = resolve(this.dirname, str.val);

        switch (typeof data) {
            case "string":
            case "number":
            case "boolean":
            case "function":
                fs.writeFileSync(file, `${data}${this.sep}`);
                break;
            case "object":
                fs.writeFileSync(file, `${JSON.stringify(data)}${this.sep}`);
                break;
            default:
                throw new Error("this type is not allowed");
        };

        return file;
    }
}