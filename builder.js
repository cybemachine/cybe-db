import { exec } from 'child_process';
import { promisify } from 'util';

function runcmd(command) {
    return promisify(exec)(command)
}

Promise.all([runcmd('tsc --project ./tsconfig.json'), runcmd('tsc --project ./tsconfig.es5.json')])
    .then(console.log, console.error)