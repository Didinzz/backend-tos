const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Modul = sequelize.define('Modul', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publicId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pertemuanKe: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  matakuliahId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'matakuliahs',
      key: 'id'
    }
  }
}, {
  tableName: 'moduls'
});


module.exports = Modul;