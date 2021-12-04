import {
    exec
} from 'child_process';
const cwd = process.cwd();

(async () => {
    await new Promise((r, j) => exec(`tsc ${cwd}\\ts\\index.ts -d --declarationMap -t ESnext --outDir ${cwd}\\dist`, r));
})();