//jobSchema.js
const {DataTypes} = require('sequelize');
const sequelize = require('../database/database');
const User = require('./userSchema');

//Job pgadmin4 makeup:
//
//id - integer
//title - character varying not null?
//company - character varying not null?
//link - text
//location - character varying
//workType - character varying
//basicReqs - text
//preferredReqs - text
//datePosted - date (needs sequelize to specify dateonly, else will take additional info)
//status - character varying
//appliedDate - date

const Job = sequelize.define('Job', {
    id: {type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    title: {type:DataTypes.STRING, allowNull:false},
    company: {type:DataTypes.STRING, allowNull:false},
    link: {type:DataTypes.TEXT},
    location: {type:DataTypes.STRING},
    workType: {type:DataTypes.STRING},
    basicReqs: {type:DataTypes.TEXT},
    preferredReqs: {type:DataTypes.TEXT},
    datePosted: {type:DataTypes.DATEONLY},
    status: {type:DataTypes.STRING},
    appliedDate: {type:DataTypes.DATEONLY},
    userId: {
        
        type:DataTypes.INTEGER,
        references: {model: User, key: 'id'},
        allowNull:false
    },
    createdAt: {type:DataTypes.DATE, defaultValue: DataTypes.NOW},
});

//foreign key relationship
//Video.belongsTo(User, {foreignKey: 'userId'});

module.exports = Job;