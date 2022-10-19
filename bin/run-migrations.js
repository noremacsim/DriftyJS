#!/usr/bin/env node

console.log('running');
const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');
const path = require("path");
const fs = require("fs");
console.log('a');
dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mariadb',
    logging: false
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

let migrations = [];

fs.readdirSync(path.join(__dirname, '../App/migrations/'))
    .filter(file => file !== 'index.js')
    .forEach(file => {
        migrations = migrations.concat(require(path.join(__dirname, `../App/migrations/${file}`)))
    });

processMigrations(migrations);


async function processMigrations(migrations) {
  let queryInterface = sequelize.getQueryInterface();

  for (let migrate of migrations) {

    if (migrate.method === 'addColumn') {
      let exists = await checkIfExists(migrate.table, migrate.field);
      if (exists.length < 1) {
        queryInterface.addColumn(migrate.table, migrate.field, migrate.config);
      }
    }

    if (migrate.method === 'changeColumn') {
      let exists = await checkIfExists(migrate.table, migrate.field);
      if (exists.length > 0) {
        queryInterface.changeColumn(migrate.table, migrate.field, migrate.config);
      }
    }

    if (migrate.method === 'removeColumn') {
      let exists = await checkIfExists(migrate.table, migrate.field);
      if (exists.length > 0) {
        queryInterface.removeColumn(migrate.table, migrate.field, migrate.config);
      }
    }
  }
}

async function checkIfExists(table, column) {
  console.log('checking if exists');
  const [results, metadata] = await sequelize.query(
    `SHOW COLUMNS FROM ${table} LIKE '${column}'`
  );
  return results;
}

console.log('Done');
