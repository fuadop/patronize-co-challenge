import { Model } from 'sequelize';

module.exports = (sequelize, Sequelize) => {
  class Transaction extends Model {
    toJSON() {
      return { ...this.get(), id: undefined }
    }
  };

  Transaction.init({
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: ['pending', 'failed', 'success']
      },
    },
    from: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    }, 
    to: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
  }, {
    sequelize,
    tableName: 'transactions',
    timestamps: true,
  });

  return Transaction;
};
