import { Model } from 'sequelize';

module.exports = (sequelize, Sequelize) => {
  class Beneficiary extends Model {
    toJSON() {
      return { ...this.get(), id: undefined }
    }

    associate({ User }) {
      Beneficiary.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
        targetKey: '_id',
      })  
    }
  };

  Beneficiary.init({
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    bankName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    accountName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'beneficiaries',
    timestamps: true, 
  });

  return Beneficiary;
};
