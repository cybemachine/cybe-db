const fs = require("fs");
const path = require("path");
const Db = require("../app/index").default;

const datastore = new Db("./db.json", {
  debug: true
});

it("init", () => {
  datastore.save();
  expect(fs.existsSync("./db.json")).toBeTruthy();
});

it("set", () => {
  datastore.set("name", {
    data: 1,
  });
  expect(datastore.data).toStrictEqual([{ id: 'name', data: 1 }])
});

it("get", () => {
  datastore.data = [{ id: 'name', data: 1 }]
  expect(datastore.get("name")).toStrictEqual({ id: 'name', data: 1 });
})

it("delete", () => {
  datastore.data = [{ id: 'name', data: 1 }]
  datastore.delete("name");
  expect(datastore.data.length).toBe(0);
});

it("deleteall", () => {
  datastore.data = [{ data: "", id: "hi" }];
  datastore.deleteAll();
  expect(datastore.data.length).toBe(0);
});

it("JSON", () => {
  const newnow = [{ id: "hi", data: 1 }];

  expect(datastore.JSON()).toBe(datastore.data);
  expect(datastore.JSON(newnow)).toBe(newnow);
  expect(datastore.data.length).toBe(1);
});

it("toString", () => {
  expect(datastore.toString()).toBe(JSON.stringify(datastore.data));
})

beforeEach(() => {
  datastore.data = [];
})

afterAll(() => {
  fs.rmSync('./db.json')
  fs.readdirSync("./backup").forEach((e, i, a) => {
    fs.rmSync(path.resolve("./backup", e))
    if (a.length - 1 == i) fs.rmdirSync('./backup')
  })
})