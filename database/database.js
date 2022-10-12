const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'Fatosemitos12',{
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;