import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';

export interface UserAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.senha);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome não pode ser vazio' },
        len: { args: [2, 100], msg: 'Nome deve ter entre 2 e 100 caracteres' },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'E-mail inválido' },
        notEmpty: { msg: 'E-mail não pode ser vazio' },
      },
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Senha não pode ser vazia' },
      },
    },
  },
  {
    sequelize,
    tableName: 'usuarios',
    modelName: 'User',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.senha) {
          user.senha = await bcrypt.hash(user.senha, 12);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('senha')) {
          user.senha = await bcrypt.hash(user.senha, 12);
        }
      },
    },
  }
);

export default User;
