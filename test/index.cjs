const cybedb = require("cybe-db/dist/es5/index.js");

const db = new cybedb('./tmp/index.json');
db.set('hi', true)