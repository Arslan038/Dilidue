'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class news extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      news.belongsTo(models.users);
      news.hasMany(models.news_likes);
    }
  }
  news.init(
    {
      image: DataTypes.STRING,
      contributor: DataTypes.STRING,
      location: DataTypes.STRING,
      url: DataTypes.STRING,
      position: DataTypes.GEOMETRY,
      status: DataTypes.BOOLEAN,
      title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'news',
    }
  );
  return news;
};
