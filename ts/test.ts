import cybedb from './index';

var db = new cybedb('../../db');

(async () => {
    var str = await db.insert("f18") || null;
    console.log(str)
})();