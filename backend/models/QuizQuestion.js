const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QuizQuestion = sequelize.define('QuizQuestion', {
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('boolean', 'input', 'checkbox'),
      allowNull: false,
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true, 
  });

  return QuizQuestion;
};
