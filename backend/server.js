const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const defineUser = require('./models/User');
const fs = require('fs');
const { Sequelize, Op, or, where, fn, col, literal } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { text } = require('stream/consumers');
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");
const { Quiz, QuizQuestion, QuizOption } = require("./models");

require('dotenv').config();

sequelize.authenticate()
  .then(() => console.log('DB connected successfully!'))
  .catch(err => console.error('DB connection error:', err));

const app = express();

app.use(cors({
  origin: [
    'https://fvx407wv-5175.euw.devtunnels.ms',
  ],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const User = defineUser(sequelize);

app.get("/api/check-server", async(req,res)=>{
  res.status(201).json({ message: "Server is working" });
})

app.post("/api/create-quiz", async (req, res) => {
  try {
    const { title, createdBy, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: "Missing title or questions" });
    }

    const quiz = await Quiz.create({ title, createdBy });

    for (const q of questions) {
      const question = await QuizQuestion.create({
        quizId: quiz.id,
        questionText: q.questionText,
        type: q.type,
        correctAnswer:
          q.type === "boolean"
            ? String(q.correctAnswer)
            : q.type === "input"
            ? q.correctAnswer
            : null,
      });

      if (q.type === "checkbox" && q.options?.length) {
        for (const opt of q.options) {
          await QuizOption.create({
            questionId: question.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
          });
        }
      }
    }

    res.status(201).json({ message: "Quiz created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id, {
      include: [
        {
          model: QuizQuestion,
          attributes: ["id", "questionText", "type", "correctAnswer"],
          include: [
            {
              model: QuizOption,
              attributes: ["id", "text", "isCorrect"],
            },
          ],
        },
      ],
      order: [
        [QuizQuestion, "id", "ASC"],
        [QuizQuestion, QuizOption, "id", "ASC"],
      ],
    });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});


const PORT = process.env.PORT || 5000; 

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');

    app.listen(PORT, () => console.log('🚀 Server on http://localhost:5000'));
  } catch (err) {
    console.error('❌ DB Error:', err);
  }
})();
