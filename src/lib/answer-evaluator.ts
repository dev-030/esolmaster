import { Question } from "@/types"

export function evaluateAnswer(question: Question, userAnswer: string | string[]): boolean {
  const correct = question.correctAnswers ?? []

  switch (question.type) {
    case "mcq":
    case "gap_mcq": {
      const answer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer
      return correct.includes(answer)
    }
    case "text_input": {
      const answer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer
      return correct.some((c) => c.toLowerCase().trim() === answer.toLowerCase().trim())
    }
    case "matching": {
      if (!question.pairs || !Array.isArray(userAnswer)) return false
      const expected = question.pairs.map((p) => `${p.left}::${p.right}`)
      return (
        userAnswer.length === expected.length &&
        userAnswer.every((a) => expected.includes(a))
      )
    }
    case "flashcard":
      return true
    default:
      return false
  }
}

export function formatAnswer(answer: string | string[] | undefined): string {
  if (!answer) return "—"
  if (Array.isArray(answer)) {
    if (answer.length === 0) return "—"
    return answer.map((a) => a.replace("::", " → ")).join(", ")
  }
  return answer
}