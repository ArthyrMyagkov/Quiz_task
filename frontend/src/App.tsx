import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateQuiz from "./pages/CreateQuiz";
import MainPage from "./pages/MainPage"
import Quizzes from "./pages/Quizzes"
import Quiz from "./pages/Quiz"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create" element={<CreateQuiz />} />
      <Route path="/quizzes" element={<Quizzes />} />
      <Route path="/quizzes/:id" element={<Quiz />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
