let db;

beforeAll(() => {
    import datastore from '../app/v1';
    db = new datastore();
})

test("Import", () => {
    expect(db).toBeTruthy();
    expect(db.options).toBe({
        spaces: 0,
        debug: false,
        syncOnWrite: true,
        asyncWrite: false
    });
    expect(db.path).tomatch(/index\.json/);
    expect(db.data).toBe({});
});

test("get", () => {
    db.data["test"] = "test";
    expect(db.get("test")).toBe("test");
});

test("delete", () => {
    db.data["test"] = "test";
    expect(db.delete("test")).toBe(db);
})