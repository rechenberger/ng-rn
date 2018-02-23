const fs = require('fs')
const cpx = require('cpx')
const changeCase = require('change-case')

class NgRename {
  constructor(oldName, newName, options) {
    this.dir = options.dir || process.env.cwd
    this.old = this.createNames(oldName)
    this.new = this.createNames(newName)
  }

  execute() {
    // Copy Files
    this.copyFiles()
    // Rename Files
    // Replace EVERYWHERE
    // (next char is not: -,[A-Z] )
  }

  async copyFiles() {
    await new Promise((res, rej) => cpx.copy(`${this.old.folder}/**`, `${this.new.folder}`, err => err ? rej(err) : res()))
  }

  createNames(name) {
    const names = {
      fileName: changeCase.paramCase(name),
      className: changeCase.pascalCase(name),

    }
    names.folder = `${this.dir}/${names.fileName}`
    return names
  }
}

module.exports = { NgRename }