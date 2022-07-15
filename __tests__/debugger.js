const { existsSync, rmSync, readFileSync } = require("fs");
const debugge = require("../app/emitdebugger").default;

const debug = new debugge("./index.json");


describe("Array checks", () => {
  it("debug", () => {
    debug.newdebug("Debug", "hi");
    expect(debug.data[0]).toBe(`${new Date()} Debug hi`)
  })

  it("error", () => {
    debug.newdebug("Error", "hi");
    expect(debug.data[0]).toBe(`${new Date()} Error hi`)
  })
})

describe("File checks", () => {
  it("init", () => {
    expect(existsSync(debug.file)).toBe(false);
    debug.save();
    expect(existsSync(debug.file)).toBe(true);
  });

  it("debug", () => {
    debug.newdebug("Debug", "hi");
    debug.save();
    expect(existsSync(debug.file)).toBe(true);
    expect(readFileSync(debug.file).toString()).toBe(`${new Date()} Debug hi`)
  })

  it("error", () => {
    debug.newdebug("Error", "hi");
    debug.save();
    expect(readFileSync(debug.file).toString()).toBe(`${new Date()} Error hi`)
  })
})

beforeEach(() => {
  debug.data = [];
});

afterEach(() => {
  if (existsSync(debug.file)) rmSync(debug.file)
})

afterAll(() => {
  if (existsSync("./index.json")) rmSync("./index.json")
})