#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const moduleDir = 'Modules';

const args = process.argv.slice(2);
const gitRepo = args[0];

if (!fs.existsSync(moduleDir)){
    fs.mkdirSync(moduleDir);
}

const repoUrl = gitRepo.split("/");
const name = repoUrl.slice(-1)[0]

async function installModule(gitRepo, name) {
    const { stdout, stderr } = await exec(`git clone ${gitRepo} Modules/${name}`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}

installModule(gitRepo, name);