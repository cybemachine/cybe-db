import { promisify } from 'util';
import { exec } from 'child_process';

const runcmd = (cmd = '') =>
    promisify(exec)(`tsc --project ./tsconfig${cmd}.json`);

function sucess() {
    sucess = () => { };
    console.log('Build Successful');
}

Promise.all([runcmd('.es5'), runcmd()]).then((v) => {
    let err = '';
    v.forEach((e, i) => {
        err += e.stderr;
        if (i == v.length - 1) {
            if (err.length > 0) return console.log(err);
            sucess();
        }
    });
}, console.error);