import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import dist from '../dist/index.js';
import polyfill from './polyfill.js';

polyfill();

let classer;

async function main() {
    const irpt = await inquirer.prompt([{
        type: 'input',
        name: 'dbpath',
        message: 'Enter the name of the database:',
        default: './cache.json',
        validate: v => v.length > 0 ? true : 'Please enter a valid path'
    }]);

    classer = new dist(irpt.dbpath, {
        "humanReadable": true,
        "saveInterval": 1000 * 2,
    });

    console.log(chalk.green(`Database ${irpt.dbpath} created`));
    await run();
}

function validate(input) {
    if (input <= 0) return 'Please enter a valid id';
    if (classer.get(input) == undefined) return 'id not found';
    return true;
}

function del(path, func) {
    fs.existsSync(path) && func(path);
}

const choices = {
    "Create a new entry": async () => {
        const { id, val } = await inquirer.prompt([{
            type: 'input',
            name: 'id',
            message: 'Enter the id of the entry:',
            validate: v => v.length > 0 ? true : 'Enter a value'
        }, {
            type: 'input',
            name: 'val',
            message: 'Enter the value of the entry:',
            validate: v => v.length > 0 ? true : 'Enter a value'
        }]);
        console.log(chalk.green(`Entry ${id} created`));
        classer.set(id, val);
    },

    "Save": async () => {
        classer.save();
        console.log(chalk.green('Saved'));
    },

    "Get an entry": async () => {
        let f = await inquirer.prompt([{
            type: 'input',
            name: 'id',
            message: 'Enter the id of the entry:',
            validate
        }]);
        console.log(`fetched data: ${chalk.green(JSON.stringify(classer.get(f.id)))}`);
    },

    "Get all entries": async () => {
        console.log(`fetched data: ${chalk.green(JSON.stringify(classer.JSON()))}`);
    },

    "Delete an entry": async () => {
        const { id } = await inquirer.prompt([{
            type: 'input',
            name: 'id',
            message: 'Enter the id of the entry:',
            validate
        }]);

        console.log(`deleting: ${chalk.red(id)}:${JSON.stringify(classer.get(id))}`);
        classer.delete(id);
    },

    "Delete all entries": async () => {
        classer.deleteAll();
        console.log(`deleting: ${chalk.red("ALL")}`)
    },

    "Exit": async () => {
        console.log(`data: ${chalk.yellow(classer.data.toString())}`);
        console.log(chalk.red('Exiting...'));
        del(classer.path, fs.rmSync);
        if (fs.existsSync(classer.backupdir))
            fs.readdirSync(classer.backupdir).flatMap((e, i, j) => {
                del(`${classer.backupdir}/${e}`, fs.rmSync)
                if (i == j.length - 1) del(classer.backupdir, fs.rmdirSync)
            });
        process.exit(0);
    }
}

async function run() {
    const f = await inquirer.prompt([{
        type: 'list',
        name: 'runner',
        message: 'What would you like to do?',
        choices: Object.keys(choices)
    }]);
    choices[f.runner]().then(() => run());
}

main()