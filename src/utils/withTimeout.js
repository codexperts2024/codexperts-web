const DEFAULT_TIMEOUT_MS = 15000

export function withTimeout(
  promise,
  ms = DEFAULT_TIMEOUT_MS,
  message = 'Request timed out. Check your connection and try again.'
) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(message))
    }, ms)

    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}
