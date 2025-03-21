//userSchema.js
const {DataTypes} = require('sequelize');
const sequelize = require('../database/database');

//User pgadmin4 makeup:
//
//id - integer
//email - character varying (strings of variable length aka varchar)
//password - character varying
//createdAt - timestamp without timezone (datatypes date coherent )
//emailVtoken - character varying
//isVerified - boolean
//passwordVtoken - character varying

const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    email: {type: DataTypes.STRING, allowNull:false, unique:true},
    password: {type: DataTypes.STRING, allowNull:false, unique:true},
    emailVtoken: {type: DataTypes.STRING, allowNull:true},
    isVerified: {type: DataTypes.BOOLEAN, allowNull:true},
    passwordVtoken: {type: DataTypes.STRING, allowNull:true},
    createdAt: {type:DataTypes.DATE, defaultValue: DataTypes.NOW},
});

module.exports = User;