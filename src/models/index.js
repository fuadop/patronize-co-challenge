import { Sequelize } from 'sequelize';
import dbConfig from '../config/db';
import User from './User';
import Beneficiary from './Beneficiary';
import Transaction from './Transaction';

const sequelize = new Sequelize(dbConfig);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User(sequelize, Sequelize);
db.Transaction = Transaction(sequelize, Sequelize);
db.Beneficiary = Beneficiary(sequelize, Sequelize);

// Associate models
db.User.associate(sequelize.models);
db.Beneficiary.associate(sequelize.models);

export default db;
