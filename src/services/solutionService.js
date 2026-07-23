import { backendFetch } from '@/lib/backendApi'

export const SOLUTION_LANGUAGES = [
  { value: 'python', label: 'Python', monaco: 'python' },
  { value: 'java', label: 'Java', monaco: 'java' },
  { value: 'c', label: 'C', monaco: 'c' },
  { value: 'cpp', label: 'C++', monaco: 'cpp' },
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript' },
  { value: 'typescript', label: 'TypeScript', monaco: 'typescript' },
]

export function languageLabel(value) {
  return SOLUTION_LANGUAGES.find((l) => l.value === value)?.label ?? value
}

export async function executeCode({ accessToken, language, code, stdin = '' }) {
  return backendFetch('/execute', {
    accessToken,
    method: 'POST',
    body: { language, code, stdin },
  })
}

export async function executeSamples({ accessToken, problemId, language, code }) {
  return backendFetch('/execute/samples', {
    accessToken,
    method: 'POST',
    body: {
      problem_id: problemId,
      language,
      code,
    },
  })
}

export async function submitSolution({ accessToken, problemId, language, code }) {
  return backendFetch('/submissions', {
    accessToken,
    method: 'POST',
    body: {
      problem_id: problemId,
      language,
      code,
    },
  })
}
