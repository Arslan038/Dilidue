'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class brandings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      brandings.belongsTo(models.users);
    }
  }
  brandings.init(
    {
      image: DataTypes.STRING,
      company_name: DataTypes.STRING,
      expert_name: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      service_title: DataTypes.STRING,
      service_description: DataTypes.STRING,
      location: DataTypes.STRING,
      position: DataTypes.GEOMETRY,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'brandings',
    }
  );
  return brandings;
};
