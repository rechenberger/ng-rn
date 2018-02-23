const fs = require('fs')
const rimraf = require('rimraf')
const { exec } = require('child_process')
const { NgRename } = require('.')

const PROJECTNAME = 'test-project'
const COMP_DIR = `${__dirname}/${PROJECTNAME}/src/app`
const OLD_COMP_NAME = 'some-button'
const NEW_COMP_NAME = 'better-button'

async function main() {
  console.log('removeProject')
  await removeProject()
  console.log('initProject')
  await initProject()
  console.log('newComponent')
  await newComponent()
  console.log('rename')
  await rename()
  console.log('done')
}

async function removeProject() {
  new Promise(res => rimraf(PROJECTNAME, res))
}

async function initProject() {
  return executeCommand(`ng new ${PROJECTNAME} --skip-install`)
}

async function newComponent() {
  return executeCommand(`cd ${COMP_DIR} && ng g c ${OLD_COMP_NAME}`)
}

async function executeCommand(command) {
  return new Promise((res, rej) => {
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
  await ngRename.execute()
}


main()