const fs = require('fs')
const rimraf = require('rimraf')

async function main() {
  removeProject()
}

async function removeProject() {
  new Promise(res => rimraf('test-project', res))
}


main()