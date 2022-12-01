#!/usr/bin/env node
const fs = require('fs');
const moduleDir = 'Modules';
const { Controllers } = require('../Core/')

const args = process.argv.slice(2);
const gitRepo = args[0];

if (!gitRepo) {
    console.log('No Repo Url Passed. Please pass this as an argument');
    process.exit();
}

if (!fs.existsSync(moduleDir)){
    fs.mkdirSync(moduleDir);
}

const repoUrl = gitRepo.split("/");
const name = repoUrl.slice(-1)[0]
Controllers.driftyInstaller.installModules(gitRepo, name)

