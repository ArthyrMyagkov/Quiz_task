const sequelize = require('../config/database');
const Quiz = require('./Quiz')(sequelize);
const QuizQuestion = require('./QuizQuestion')(sequelize);
const QuizOption = require('./QuizOption')(sequelize);

Quiz.hasMany(QuizQuestion, { foreignKey: 'quizId', onDelete: 'CASCADE' });
QuizQuestion.belongsTo(Quiz, { foreignKey: 'quizId' });

QuizQuestion.hasMany(QuizOption, { foreignKey: 'questionId', onDelete: 'CASCADE' });
QuizOption.belongsTo(QuizQuestion, { foreignKey: 'questionId' });

module.exports = { sequelize, Quiz, QuizQuestion, QuizOption };