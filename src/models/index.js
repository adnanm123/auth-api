'use strict';

require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const clothesModel = require('./clothes/model');
const foodModel = require('./food/model');
const userModel = require('../auth/models/users'); 
const Collection = require('./data-collection');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite:memory:', {
  dialect: 'postgres', 
});
const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  food: new Collection(food),
  clothes: new Collection(clothes),
  users: users
};
