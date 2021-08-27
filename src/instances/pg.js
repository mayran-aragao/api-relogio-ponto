const { Sequelize } = require('sequelize');
require('dotenv').config();


// const sequelize = new Sequelize(
//     process.env.PG_DB,
//     process.env.PG_USER,
//     process.env.PG_PASSWORD,
//     {
//         dialect: 'postgres',
//         port: process.env.PG_PORT
//     }

// );
const sequelize = new Sequelize('postgres://usr_aplicacao:aplicacao@172.16.2.222:9001/dbatdc')

module.exports = sequelize