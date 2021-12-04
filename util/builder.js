import { exec } from "child_process";
const g = process.cwd();

exec(`tsc ${g}\\ts\\*.ts -d --declarationMap --outDir ${g}/dist`, (r) => console.log(r ? `exec error: ${r}` : "a ok"));