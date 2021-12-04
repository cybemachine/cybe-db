import clas from "../dist/index.js";
var db = new clas(`${process.cwd()}\\db`);
var saved = db.insert({
    "hi": true
})
var id = saved._id;

setTimeout(() => {
    db.delete(id)
    console.log(db);
}, 1000)