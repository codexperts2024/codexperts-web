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

export async function evaluateSolution({
  accessToken,
  problemId,
  language,
  code,
  samplesPassed,
}) {
  return backendFetch('/evaluate', {
    accessToken,
    method: 'POST',
    body: {
      problem_id: problemId,
      language,
      code,
      samples_passed: samplesPassed,
    },
  })
}

/** Official docs for syntax help (no AI). */
export const LANGUAGE_DOCS = {
  python: {
    label: 'Python docs',
    href: 'https://docs.python.org/3/tutorial/datastructures.html',
  },
  java: {
    label: 'Java SE API',
    href: 'https://docs.oracle.com/en/java/javase/17/docs/api/',
  },
  c: {
    label: 'C reference',
    href: 'https://en.cppreference.com/w/c',
  },
  cpp: {
    label: 'C++ reference',
    href: 'https://en.cppreference.com/w/cpp',
  },
  javascript: {
    label: 'MDN JavaScript',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  },
  typescript: {
    label: 'TypeScript handbook',
    href: 'https://www.typescriptlang.org/docs/handbook/intro.html',
  },
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
