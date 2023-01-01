const assert = require("assert");
const debugge = require("../app/emitdebugger").default;
const { existsSync, rmSync, readFileSync } = require("fs");

const debug = new debugge("./index.json");

describe("Array checks", () => {
  it("debug", () => {
    debug.data = [];
    debug.newdebug("Debug", "hi");
    assert.equal(debug.data[0], `${new Date()} Debug hi`);
  });

  it("error", () => {
    debug.data = [];
    debug.newdebug("Error", "hi");
    assert.equal(debug.data[0], `${new Date()} Error hi`);
  });
});

describe("File checks", () => {
  it("init", () => {
    debug.data = [];
    assert.equal(existsSync(debug.file), false);
    debug.save();
    assert.equal(existsSync(debug.file), true);
    if (existsSync(debug.file)) rmSync(debug.file);
  });

  it("debug", () => {
    debug.data = [];
    debug.newdebug("Debug", "hi");
    debug.save();
    assert.equal(existsSync(debug.file), true);
    assert.equal(readFileSync(debug.file).toString(), `${new Date()} Debug hi`);
    if (existsSync(debug.file)) rmSync(debug.file);
  });

  it("error", () => {
    debug.data = [];
    debug.newdebug("Error", "hi");
    debug.save();
    assert.equal(readFileSync(debug.file).toString(), `${new Date()} Error hi`);
    if (existsSync(debug.file)) rmSync(debug.file);
  });
});
