import FileMan from "./fileman";

export default class Debugger {
  file: FileMan<string[]>;
  data: string[];
  inmem: boolean;
  constructor(file = `./file.log`, inMemoryOnly: boolean = false) {
    this.inmem = inMemoryOnly;
    if (!inMemoryOnly) this.file = new FileMan(file, {
      'readInitFile': false
    });
    this.data = [];
  }

  save() {
    if (this.inmem) return;
    this.file.append(this.data);
    this.data = [];
  }

  newdebug(method: "Error" | "Debug", data: string) {
    this.data.push(`${new Date()} ${method} ${data}`);
    if (this.inmem) {
      console[method == "Error" ? "error" : "debug"](this.data.pop());
      return;
    }
    if (this.data.length >= 50) this.save();
  }
}
