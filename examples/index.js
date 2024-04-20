const path = require("path");
const express = require("express");
const DataBase = require("../app/index").DB;

const app = express();
const DB = new DataBase(path.resolve(__dirname, './db.dat'));

app.use(express.json());

app.get('/:title', (req, res) => {
    const employees = DB.find({ title: req.params.title });
    if (employees.length < 1) return res.status(404).send({ status: 'failed', message: 'not found' });
    res.send(employees);
})

//save new employee
app.post('/new', function (req, res) {
    if (!req.body.title || !req.body.name) return res.status(400).send({ status: 'failed', message: "No params" })
    const id = DB.insert({ title: req.body.title, name: req.body.name });
    res.status(200).send({ stauts: 'success', id })
});

//update an employee
app.put('/:id/edit', function (req, res) {
    if (!req.body.name || !req.body.title) return res.status(400).send({ status: 'failed', message: "Required body" });
    const updated = DB.update({ _id: req.params.id }, { name: req.body.name, title: req.body.title });
    res.status(200).send({
        status: 'success',
        updated
    })
});

//delete an employee
app.delete('/:id', function (req, res) {
    const num = DB.delete({ _id: req.params.id })
    res.send({ status: 'success', deleted: num });
});

app.listen(8080);