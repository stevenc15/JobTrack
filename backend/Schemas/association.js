//associations.js
const User = require('./userSchema');
const Job = require('./jobSchema');

// Define associations here
User.hasMany(Job, { foreignKey: 'userId', as: 'jobList', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Job };