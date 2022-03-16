const cybedb = require("cybe-db");

const db = new cybedb('./tmp/index.json');
db.set('hi', true)