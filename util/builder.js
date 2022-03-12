import { exec } from 'child_process';
import { promisify } from 'util';

const runcmd = (cmd = '') =>
    promisify(exec)(`tsc --project ../config/tsconfig${cmd}.json`);

Promise.all([runcmd('.es5'), runcmd()]).then((v) => {
    let err = '';
    v.forEach((e, i) => {
        err += e.stderr;
        (i == v.length - 1) && err.length > 0 ? console.log(err) : console.log('Build Successful');
    });
}, console.error);