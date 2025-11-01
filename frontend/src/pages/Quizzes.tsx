import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api.ts';
import type { Quiz } from '../types';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await API.get('/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load quizzes.');
      }
    }

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-[95vh] bg-gradient-to-b from-white to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Quizzes</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {quizzes.length === 0 && <p className="text-gray-500">No quizzes found.</p>}

        <div className="space-y-4">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="p-4 bg-white rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{q.title}</h2>
                <p className="text-gray-500 text-sm">
                  Created by User {q.createdBy} on {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => navigate(`/quizzes/${q.id}`)}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 cursor-pointer"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
