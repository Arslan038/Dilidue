'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class news_likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  news_likes.init(
    {
      action: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'news_likes',
    }
  );
  return news_likes;
};
