const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Readinglist extends Model {}

Readinglist.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'readinglist'
})

module.exports = Readinglist