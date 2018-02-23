const fs = require('fs')
const cpx = require('cpx')
const changeCase = require('change-case')
const rimraf = require('rimraf')
const replaceInFile = require('replace-in-file')

class NgRename {
  constructor(oldName, newName, options) {
    this.dir = options.dir || process.env.cwd
    this.old = this.createNames(oldName)
    this.new = this.createNames(newName)
  }

  async execute() {
    await this.copyFiles()
    await this.replace()
  }

  async copyFiles() {
    // // Copy Files
    await new Promise((res, rej) => cpx.copy(`${this.old.folder}/**`, `${this.new.folder}`, err => err ? rej(err) : res()))
    // // Delete old Files
    await new Promise(res => rimraf(this.old.folder, res))
    // Rename files
    const files = fs.readdirSync(this.new.folder)
    files.forEach(file => {
      const newFileName = file.replace(this.old.fileName, this.new.fileName)
      fs.renameSync(`${this.new.folder}/${file}`, `${this.new.folder}/${newFileName}`)
    })
  }

  createNames(name) {
    const names = {
      fileName: changeCase.paramCase(name),
      className: `${changeCase.pascalCase(name)}Component`,
    }
    names.folder = `${this.dir}/${names.fileName}`
    return names
  }

  async replace() {
    const ngProjectDir = this.findNgProjectDir()
    const files = `${ngProjectDir}/src/**`

    const ps = ['fileName', 'className']

    for (let property of ps) {
      const fromString = this.old[property]
      const toString = this.new[property]

      const from = new RegExp(`(${fromString})([^-a-zA-Z0-9])`, 'g')
      // console.log('RegEx', from)
      const to = `${toString}$2`

      const results = await replaceInFile({
        files,
        from,
        to
      })

      // console.log("updated", results)
    }

  }

  findNgProjectDir(dir) {
    dir = dir || this.dir
    try {
      fs.readFileSync(`${dir}/.angular-cli.json`)
      return dir
    }
    catch (e) {
      return this.findNgProjectDir(`${dir}/..`)
    }
  }
}

module.exports = { NgRename }