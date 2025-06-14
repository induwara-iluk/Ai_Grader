import React, { useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = 'https://ai-grader-vyc9.onrender.com';

const questions = [
  {
    id: 1,
    question: `(i) What should you do to the travelling microscope to see a clear image of the pin again?`,
    correct_answer: `Move the travelling microscope upward (until a clear image of O is seen).`,
    max_marks: 2,
  },
  {
    id: 2,
    question: `(ii) Write down the experimental steps that you follow to measure the height (h) of the liquid column.`,
    correct_answer: `Float few fine plastic pieces/powder on liquid and move the microscope upward until a clear image of plastic pieces/powder are seen. (Take reading z)`,
    max_marks: 2,
  },
  {
    id: 3,
    question: `(iii) Write down expressions for height (h) of the liquid column and the apparent displacement (d) of the image using readings x, y and z.`,
    correct_answer: `h = z - x\nd = y - x`,
    max_marks: 2,
  },
]

export default function App() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const [results, setResults] = useState(Array(questions.length).fill(''))
  const [loading, setLoading] = useState(false)

  const handleChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const newResults = []

    for (let i = 0; i < questions.length; i++) {
      try {
        const response = await axios.post('/grade', {
          question: questions[i].question,
          correct_answer: questions[i].correct_answer,
          student_answer: answers[i],
          max_marks: questions[i].max_marks,
        })
        newResults[i] = response.data.result
      } catch (error) {
        newResults[i] = 'Error grading this question.'
      }
    }

    setResults(newResults)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Essay & Lab Grader</h1>

      {questions.map((q, idx) => (
        <div key={q.id} className="mb-8">
          <p className="font-semibold mb-2">{q.question}</p>
          <textarea
            rows={4}
            value={answers[idx]}
            onChange={e => handleChange(idx, e.target.value)}
            className="w-full border rounded p-2 focus:outline-none"
            placeholder="Type your answer here..."
          />
          {results[idx] && (
            <div className="mt-2 bg-gray-50 border-l-4 border-blue-500 p-3">
              <pre className="whitespace-pre-wrap text-sm">{results[idx]}</pre>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Grading...' : 'Submit All'}
      </button>
    </div>
  )
}
