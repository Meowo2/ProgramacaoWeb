import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Country from './Country';

export interface CityAttributes {
  id: number;
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  id_pais: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CityCreationAttributes extends Optional<CityAttributes, 'id'> {}

class City
  extends Model<CityAttributes, CityCreationAttributes>
  implements CityAttributes
{
  public id!: number;
  public nome!: string;
  public populacao!: number;
  public latitude!: number;
  public longitude!: number;
  public id_pais!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

City.init(
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
    populacao: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'População deve ser um número positivo' },
      },
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [-90], msg: 'Latitude deve estar entre -90 e 90' },
        max: { args: [90], msg: 'Latitude deve estar entre -90 e 90' },
      },
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [-180], msg: 'Longitude deve estar entre -180 e 180' },
        max: { args: [180], msg: 'Longitude deve estar entre -180 e 180' },
      },
    },
    id_pais: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paises',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'cidades',
    modelName: 'City',
    indexes: [
      { fields: ['id_pais'] },
    ],
  }
);

// Associações
City.belongsTo(Country, {
  foreignKey: 'id_pais',
  as: 'pais',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

Country.hasMany(City, {
  foreignKey: 'id_pais',
  as: 'cidades',
});

export default City;
