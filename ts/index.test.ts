import datastore from './index';
import { existsSync, readFileSync } from 'fs';

var db = new datastore('./index.json', {
    "debug": false
});

function set() {
    var id = (Math.floor(Math.random() * 10) + 10).toString();
    var str = Math.floor(Math.random() * 100).toString();
    db.set(id, str).sync()
    return id;
}

it('sync function', () => {
    db.sync();

    expect(existsSync('./index.json')).toBeTruthy();
});

it('set function', () => {
    var id = set()

    var file = JSON.parse(readFileSync('./index.json', 'utf-8'));
    expect(file[id]).toBeTruthy();
});

it('has function', () => {
    var id = set()

    expect(db.has(id)).toBe(true);
});

it('delete function', () => {
    var id = set();
    db.delete(id).sync();

    var obj = JSON.parse(readFileSync('./index.json', 'utf-8'));
    expect(obj[id]).toBeUndefined();
});

it('deleteAll function', () => {
    db.deleteAll().sync();

    var obj = JSON.parse(readFileSync('./index.json', 'utf-8'))
    expect(obj).toStrictEqual({});
    expect(db.data).toStrictEqual({});
});