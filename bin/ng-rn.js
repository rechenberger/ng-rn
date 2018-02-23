#!/usr/bin/env node
'use strict'
process.title = 'ng-rn'
const { NgRename } = require('../.')
const [oldName, newName] = process.argv.slice(2)
const dir = process.cwd()
const ngRename = new NgRename(oldName, newName, { dir })
ngRename.execute()