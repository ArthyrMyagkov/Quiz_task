import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api.ts';
import type { Quiz as QuizType, QuizQuestion, QuizOption } from '../types';

export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await API.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load quiz.');
      }
    }

    fetchQuiz();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="min-h-[95vh] bg-gradient-to-b from-white to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

        {quiz.QuizQuestions.map((q: QuizQuestion, index: number) => (
          <div key={q.id} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="font-semibold mb-2">
              {index + 1}. {q.questionText} ({q.type})
            </h2>

            {q.type === "boolean" && (
              <div className="flex gap-4">
                <label>
                  <input type="radio" checked={q.correctAnswer === "true"} readOnly /> True
                </label>
                <label>
                  <input type="radio" checked={q.correctAnswer === "false"} readOnly /> False
                </label>
              </div>
            )}

            {q.type === "input" && (
              <input
                type="text"
                value={q.correctAnswer as string}
                readOnly
                className="border p-1 rounded w-full"
              />
            )}

            {q.type === "checkbox" && (
              <div className="flex flex-col gap-2">
                {q.QuizOptions?.map((opt: QuizOption) => (
                  <label key={opt.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={opt.isCorrect} readOnly />
                    {opt.text}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
