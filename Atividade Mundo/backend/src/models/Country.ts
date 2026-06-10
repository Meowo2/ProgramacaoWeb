import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Continent from './Continent';

export interface CountryAttributes {
  id: number;
  nome: string;
  populacao: number;
  idioma_oficial: string;
  moeda: string;
  id_continente: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CountryCreationAttributes extends Optional<CountryAttributes, 'id'> {}

class Country
  extends Model<CountryAttributes, CountryCreationAttributes>
  implements CountryAttributes
{
  public id!: number;
  public nome!: string;
  public populacao!: number;
  public idioma_oficial!: string;
  public moeda!: string;
  public id_continente!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Country.init(
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
    populacao: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'População deve ser um número positivo' },
      },
    },
    idioma_oficial: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Idioma oficial não pode ser vazio' },
      },
    },
    moeda: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Moeda não pode ser vazia' },
      },
    },
    id_continente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'continentes',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'paises',
    modelName: 'Country',
  }
);

// Associações
Country.belongsTo(Continent, {
  foreignKey: 'id_continente',
  as: 'continente',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

Continent.hasMany(Country, {
  foreignKey: 'id_continente',
  as: 'paises',
});

export default Country;
