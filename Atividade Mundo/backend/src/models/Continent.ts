import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ContinentAttributes {
  id: number;
  nome: string;
  descricao: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContinentCreationAttributes extends Optional<ContinentAttributes, 'id'> {}

class Continent
  extends Model<ContinentAttributes, ContinentCreationAttributes>
  implements ContinentAttributes
{
  public id!: number;
  public nome!: string;
  public descricao!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Continent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Nome não pode ser vazio' },
        len: { args: [2, 100], msg: 'Nome deve ter entre 2 e 100 caracteres' },
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Descrição não pode ser vazia' },
      },
    },
  },
  {
    sequelize,
    tableName: 'continentes',
    modelName: 'Continent',
  }
);

export default Continent;
