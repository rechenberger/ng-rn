const { NgRename } = require('../.')
const [oldName, newName] = process.argv.slice(2)
const dir = process.env.cwd
const ngRename = new NgRename(oldName, newName, { dir })
ngRename.execute()