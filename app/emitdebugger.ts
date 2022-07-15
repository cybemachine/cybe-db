import fs from "fs";

export default class Debugger {
  file: string;
  data: string[];
  constructor(file = `./file.log`) {
    this.file = file;
    this.data = [];
  }

  save() {
    fs.appendFileSync(this.file, this.data.join("\n"));

    this.data = [];
  }

  newdebug(method: "Error" | "Debug", data: string) {
    this.data.push(`${new Date()} ${method} ${data}`);
    if (this.data.length >= 50) this.save();
  }
}
