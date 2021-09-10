import { Model } from 'sequelize';
import bcrypt from 'bcrypt';

module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    toJSON() {
      return { ...this.get(), id: undefined, password: undefined }
    }

    static associate({ Beneficiary }){
      User.hasMany(Beneficiary, {
        foreignKey: 'userId',
        as: 'beneficiaries'
      })
    }

    static async doesUserExist(email) {
      const user = await User.findOne({
        where: {
          email
        }
      });

      return !!user;
    }
  };

  User.init({
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      /**
       * 
       * @param {string} email 
       */
      set(email) {
        this.setDataValue('email', email.toLowerCase())
      }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      set(password) {
        // Hash password before storing
        const hash = bcrypt.hashSync(password, 10);
        this.setDataValue('password', hash)
      }  
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
