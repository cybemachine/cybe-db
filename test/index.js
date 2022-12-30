const fs = require("fs");
const path = require("path");
const assert = require("assert");
const Db = require("../app/index").default;

const datastore = new Db("./db.json", {
  debug: true,
});

it("init", () => {
  datastore.save();
  assert.equal(fs.existsSync("./db.json"), true);
});

it("set", () => {
  datastore.data = [];
  datastore.set("name", {
    data: 1,
  });
  assert.equal(datastore.data, [{ id: "name", data: 1 }]);
});

it("get", () => {
  datastore.data = [{ id: "name", data: 1 }];
  assert.equal(datastore.get("name"), { id: "name", data: 1 });
});

it("delete", () => {
  datastore.data = [{ id: "name", data: 1 }];
  datastore.delete("name");
  assert.equal(datastore.data.length, 0);
});

it("deleteall", () => {
  datastore.data = [{ data: "", id: "hi" }];
  datastore.deleteAll();
  assert.equal(datastore.data.length, 0);
});

it("JSON", () => {
  datastore.data = [];
  const newnow = [{ id: "hi", data: 1 }];

  assert.equal(datastore.JSON(), datastore.data);
  assert.equal(datastore.JSON(newnow), newnow);
  assert.equal(datastore.data.length, 1);
});

it("toString", () => {
  datastore.data = [];
  assert.equal(datastore.toString(), JSON.stringify(datastore.data));
});
