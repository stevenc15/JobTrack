const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');

//load environment variables
dotenv.config({path: './backend_details.env'});

//sequelize instance
let sequelize;

console.log('database connection string: ', process.env.CONNECTION_STRING);

//connection to database
sequelize = new Sequelize(process.env.CONNECTION_STRING);

module.exports = sequelize;