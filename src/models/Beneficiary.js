import { Model } from 'sequelize';

module.exports = (sequelize, Sequelize) => {
  class Beneficiary extends Model {
    toJSON() {
      return { ...this.get(), id: undefined }
    }

    static associate({ User }) {
      Beneficiary.belongsTo(User, {
        foreignKey: 'userId',
        targetKey: '_id',
        as: 'user'
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
    bankCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: Sequelize.STRING,
      allowNull: false,
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
