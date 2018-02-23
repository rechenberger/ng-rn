const fs = require('fs')
const rimraf = require('rimraf')
const { exec } = require('child_process')
const { NgRename } = require('.')

const PROJECTNAME = 'test-project'
const COMP_DIR = `${__dirname}/${PROJECTNAME}/src/app`
const OLD_COMP_NAME = 'some-button'
const NEW_COMP_NAME = 'better-button'

async function main() {
  // await removeProject()
  // await initProject()
  await newComponent()
  await rename()
}

async function removeProject() {
  new Promise(res => rimraf(PROJECTNAME, res))
}

async function initProject() {
  return executeCommand(`ng new ${PROJECTNAME}`)
}

async function newComponent() {
  return executeCommand(`cd ${COMP_DIR} && ng g c ${OLD_COMP_NAME}`)
}

async function executeCommand(command) {
  new Promise((res, rej) => {
    exec(command, (err) => {
      if (err) return rej(err)
      return res()
    })
  })
}

async function rename() {
  const ngRename = new NgRename(OLD_COMP_NAME, NEW_COMP_NAME, {
    dir: COMP_DIR
  })
  ngRename.execute()
}


main()