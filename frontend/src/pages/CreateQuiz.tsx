import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.ts";
import type { Quiz, QuizQuestion, QuizOption, QuestionType } from "../types";

export default function CreateQuiz() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz>({
    id: 0,
    title: "",
    createdBy: 1,
    questions: [],
  });

  const [error, setError] = useState("");

  const addQuestion = (type: QuestionType) => {
    const newQuestion: QuizQuestion = {
      type,
      questionText: "",
      options: type === "checkbox" ? [] : undefined,
      correctAnswer: type === "boolean" ? false : undefined,
    };

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const removeQuestion = (id: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, questionText: text } : q
      ),
    }));
  };

  const updateAnswer = (id: string, value: string | boolean) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, correctAnswer: value } : q
      ),
    }));
  };

  const addCheckboxOption = (questionId: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...(q.options || []),
                { id: crypto.randomUUID(), text: "", isCorrect: false },
              ],
            }
          : q
      ),
    }));
  };

  const updateCheckboxOption = (
    questionId: string,
    optionId: string,
    key: keyof QuizOption,
    value: string | boolean
  ) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt) =>
                opt.id === optionId ? { ...opt, [key]: value } : opt
              ),
            }
          : q
      ),
    }));
  };

  const removeCheckboxOption = (questionId: string, optionId: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options?.filter((opt) => opt.id !== optionId) }
          : q
      ),
    }));
  };

  const handleSaveQuiz = async () => {
    if (!quiz.title || quiz.questions.length === 0) {
      setError("Please add a title and at least one question.");
      return;
    }

    try {
      await API.post("/create-quiz", quiz);
      console.log("The quiz was created")

      navigate("/quizzes");

    } catch (err) {
      console.error("Error creating quiz:", err);
      setError("Something went wrong while creating the quiz.");
    }
  };

  useEffect(()=>{
    const CheckServer= async ()=>{
        try{
            console.log("Request sent")
            await API.get("/check-server");
            console.log("Server is working")
        }catch(err){
            console.error("Server is not working:", err);
            setError("Server is not working.");
        }
    }
    CheckServer()
  },[])

  return (
    <div className="min-h-[95vh] bg-gradient-to-b from-white to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Create Quiz</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Quiz title"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => addQuestion("boolean")}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            + Boolean
          </button>
          <button
            onClick={() => addQuestion("input")}
            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 cursor-pointer"
          >
            + Input
          </button>
          <button
            onClick={() => addQuestion("checkbox")}
            className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 cursor-pointer"
          >
            + Checkbox
          </button>
        </div>

        {quiz.questions.map((q, index) => (
          <div
            key={q.id}
            className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-gray-700">
                Question {index + 1} ({q.type})
              </h2>
              <button
                onClick={() => removeQuestion(q.id)}
                className="text-red-500 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              placeholder="Question text"
              value={q.questionText}
              onChange={(e) => updateQuestionText(q.id, e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-3"
            />

            {q.type === "boolean" && (
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name={`bool-${q.id}`}
                    checked={q.correctAnswer === true}
                    onChange={() => updateAnswer(q.id, true)}
                  />{" "}
                  True
                </label>
                <label>
                  <input
                    type="radio"
                    name={`bool-${q.id}`}
                    checked={q.correctAnswer === false}
                    onChange={() => updateAnswer(q.id, false)}
                  />{" "}
                  False
                </label>
              </div>
            )}

            {q.type === "input" && (
              <input
                type="text"
                placeholder="Correct answer"
                value={String(q.correctAnswer || "")}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
              />
            )}

            {q.type === "checkbox" && (
              <div className="mt-2">
                {q.options?.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-1"
                  >
                    <input
                      type="text"
                      placeholder="Option text"
                      value={opt.text}
                      onChange={(e) =>
                        updateCheckboxOption(q.id, opt.id, "text", e.target.value)
                      }
                      className="border border-gray-300 rounded p-1 flex-1"
                    />
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={opt.isCorrect}
                        onChange={(e) =>
                          updateCheckboxOption(
                            q.id,
                            opt.id,
                            "isCorrect",
                            e.target.checked
                          )
                        }
                      />
                      Correct
                    </label>
                    <button
                      onClick={() => removeCheckboxOption(q.id, opt.id)}
                      className="text-red-500 text-sm hover:underline cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addCheckboxOption(q.id)}
                  className="text-blue-500 text-sm hover:underline mt-1"
                >
                  + Add option
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={handleSaveQuiz}
          className="mt-4 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 cursor-pointer"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
}
