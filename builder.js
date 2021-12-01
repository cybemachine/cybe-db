const process = require('child_process');

var targets = ["ES3", "ES5", "ES6", "ESNext"]

function f(i) {
    var target = targets[i];
    if (!target) return;
    var cmd = `tsc ./ts/*.ts -d --pretty --declarationMap --sourceMap --outDir ./dist/${target} -t ${target}`;
    console.log(cmd)
    process.exec(cmd, (err, stdout, stderr) => {
        if (err) return console.error(`exec error: ${err}`);
        f(i + 1);
    })
}

f(0);