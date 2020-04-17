const fs = require('fs')
const cpx = require('cpx')
const changeCase = require('change-case')
const rimraf = require('rimraf')
const replaceInFile = require('replace-in-file')
const _ = require('lodash')

class NgRename {
  constructor(oldName, newName, options) {
    this.dir = options.dir
    this.old = this.createNames(oldName)
    this.new = this.createNames(newName)
  }

  async execute() {
    await this.copyFiles().catch()
    await this.replace().catch()
  }

  async copyFiles() {
    try {
      // Copy Files
      await new Promise((res, rej) => cpx.copy(
        `${this.old.folder}/**`,
        `${this.new.folder}`, 
        err => err ? rej(err) : res()
        )).catch((err) => {
          console.log("There was an error in the copy process: " + err);
        })
      // Delete old Files
      await new Promise(res => rimraf(this.old.folder, res)).catch((err) => {
        console.log("There was an error in the delete process: " + err);
      })
      // Rename files
      const files = fs.readdirSync(this.new.folder)
      files.forEach(file => {
        const newFileName = file.replace(this.old.fileName, this.new.fileName)
        fs.renameSync(`${this.new.folder}/${file}`, `${this.new.folder}/${newFileName}`)
      })
    }
    catch(err) {
      console.log("There was an error in the copyFiles process: " + err);
    }
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

    const updatedFiles = []

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
      }).catch((err) => {
        if(!err.toString().includes("illegal operation on a directory")) {
          console.log("There was an error in the replaceInFile process: " + err);
        }
      })

      try {
        updatedFiles.push(...results)
      } catch (err) {

      }
    }

    /* console.log('Modified the following files:')
    _(updatedFiles)
      .uniq()
      .each(updatedFile => console.log(updatedFile))
      */

  }

  findNgProjectDir(dir) {
    dir = dir || this.dir
    try {
      const angular_bigger_than6 = `${dir}/angular.json`
      const angular_lower_than6 = `${dir}/.angular-cli.json`
      if (fs.existsSync(angular_bigger_than6)) {
        fs.readFileSync(angular_bigger_than6)
        return dir
      } else if (fs.existsSync(angular_lower_than6)) {
        fs.readFileSync(angular_lower_than6)
        return dir
      } else {
        return this.findNgProjectDir(`${dir}/..`)
      }
    }
    catch (err) {
      console.log("findNgProjectDir Error: " + err)
    }
  }

  findComponentFolder(dir) {
    dir = dir || `${this.dir}/src/app`
    try {
      fs.readFileSync(`${dir}/${this.old.fileName}/${this.old.fileName}.component.ts`)
      return dir
    }
    catch (e) {
      return this.findComponentFolder(`${dir}/..`)
    }
  }
}

module.exports = { NgRename }
