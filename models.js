import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/gotech');

export const Questionnaire = sequelize.define(
  'questionnaire',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export const Question = sequelize.define(
  'question',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    questionnaireid: {
      type: DataTypes.INTEGER,
    },
    isfreetext: {
      type: DataTypes.BOOLEAN,
    },
    isrequired: {
      type: DataTypes.BOOLEAN,
    },
    followupof: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

export const Option = sequelize.define(
  'option',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
    },
    questionid: {
      type: DataTypes.INTEGER,
    },
    hasfreetext: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
  }
);

export const Result = sequelize.define(
  'result',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    questionid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    chosenoptionid: {
      type: DataTypes.INTEGER,
    },
    freetextresult: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
  }
);

Questionnaire.hasMany(Question, { foreignKey: 'questionnaireid' });
Question.belongsTo(Questionnaire, { foreignKey: 'questionnaireid' });
Question.hasMany(Option, { foreignKey: 'questionid' });
Option.belongsTo(Question, { foreignKey: 'questionid' });
Option.hasMany(Question, { foreignKey: 'followupof' });
Question.belongsTo(Option, { foreignKey: 'followupof' });
Option.hasMany(Result, { foreignKey: 'chosenoptionid' });
Result.belongsTo(Option, { foreignKey: 'chosenoptionid' });
Question.hasMany(Result, { foreignKey: 'questionid' });
Result.belongsTo(Question, { foreignKey: 'questionid' });
