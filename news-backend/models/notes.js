'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      notes.belongsTo(models.users);
    }
  }
  notes.init(
    {
      location: DataTypes.STRING,
      position: DataTypes.GEOMETRY,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'notes',
    }
  );
  return notes;
};
