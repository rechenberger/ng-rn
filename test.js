const fs = require('fs')
const rimraf = require('rimraf')
const cli = require('@angular/cli')
const { exec } = require('child_process')

const PROJECTNAME = 'test-project'

async function main() {
  await removeProject()
  await initProject()
}

async function removeProject() {
  new Promise(res => rimraf(PROJECTNAME, res))
}

async function initProject() {
  new Promise((res, rej) => {
    exec(`ng new ${PROJECTNAME}`, (err) => {
      if(err) return rej(err)
      return res()
    })
  })
}


main()