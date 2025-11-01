const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QuizOption = sequelize.define('QuizOption', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true, 
  });

  return QuizOption;
};
