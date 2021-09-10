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
        isIn: [['pending', 'failed', 'success']]
      },
    },
    from: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      /**
       * 
       * @param {string} email 
       */
      set(email) {
        this.setDataValue('from', email.toLowerCase())
      }
    }, 
    to: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      /**
       * 
       * @param {string} email 
       */
      set(email) {
        this.setDataValue('to', email.toLowerCase())
      }
    },
  }, {
    sequelize,
    tableName: 'transactions',
    timestamps: true,
  });

  Transaction.afterCreate(async (trx, ops) => {
    if (trx.status === 'pending') {
      // Get from and to and reduce and increase their balances 
      // respectively
      const { from, to } = trx;

      const fromUser = await sequelize.models.User.findOne({
        where: {
          email: from
        }
      });

      const toUser = await sequelize.models.User.findOne({
        where: {
          email: to
        }
      });

      fromUser.balance -= trx.amount;
      toUser.balance += trx.amount;
      await fromUser.save();
      await toUser.save();
      
      // Set the transaction status
      // to success
      await trx.update({
        status: 'success',
      });
    }
  });

  return Transaction;
};
