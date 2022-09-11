#!/usr/bin/env node

const path = require('path');
const {driftyCore} = require(path.join(__dirname, '../Core/'));

const args = process.argv.slice(2);
const enviroment = args[0];

driftyCore.init(enviroment);
