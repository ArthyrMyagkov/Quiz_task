import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Quiz App 🎯</h1>
      <div className="flex flex-row items-center justify-center gap-2">
      <Link
        to="/create"
        className="px-6 py-3 bg-pink-500 text-white rounded-2xl shadow-md hover:bg-pink-600 transition"
      >
        Create Quiz
      </Link>
       <Link
        to="/quizzes"
        className="px-6 py-3 bg-pink-500 text-white rounded-2xl shadow-md hover:bg-pink-600 transition"
      >
        See all quizzes
      </Link>
      </div>
    </div>
  );
}
