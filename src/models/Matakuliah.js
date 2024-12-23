const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const MatakuliahDosen = require('./MatakuliahDosen');
const Modul = require('./Modul');

const Matakuliah = sequelize.define('Matakuliah', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'matakuliahs'
});

MatakuliahDosen.belongsTo(Matakuliah, {
  foreignKey: 'matakuliahId',
  as: 'matakuliah'
});

Matakuliah.hasMany(Modul, {
  foreignKey: 'matakuliahId',
  as: 'moduls'
})

Modul.belongsTo(Matakuliah, {
  foreignKey: 'matakuliahId',
  as: 'matakuliah'
})

// Many-to-Many relationship with User (dosen)
Matakuliah.belongsToMany(User, {
  through: MatakuliahDosen,
  as: 'dosens',
  foreignKey: 'matakuliahId',
  otherKey: 'dosenId'
});

User.belongsToMany(Matakuliah, {
  through: MatakuliahDosen,
  as: 'matakuliah',
  foreignKey: 'dosenId',
  otherKey: 'matakuliahId'
});


module.exports = Matakuliah;