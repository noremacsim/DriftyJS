#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const moduleDir = 'Modules';
const { Controllers } = require('../Core/')

const args = process.argv.slice(2);
const gitRepo = args[0];

if (!fs.existsSync(moduleDir)){
    fs.mkdirSync(moduleDir);
}

const repoUrl = gitRepo.split("/");
const name = repoUrl.slice(-1)[0]
await Controllers.driftyInstaller.installModules(gitRepo, name)

