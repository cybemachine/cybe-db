const { existsSync } = require("fs");

const DataBase = require("../app/index").DB;

const DB = new DataBase("./file.dat");

console.log(existsSync("./file.dat") == true);
console.log(DB.find({}));
console.log(DB.insert({ _id: "hello", data: crypto.randomUUID() }) == "hello");