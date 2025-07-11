const getCookieError = (functionName: string) => `${functionName}() can only be used in browser environment - document is not defined`

const getCookie = (name: string) => {
  if (typeof document === 'undefined') throw new Error(getCookieError('getCookie'))

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) return parts.pop()?.split(';').shift()

  return null
}

const setCookie = (name: string, value: string) => {
  if (typeof document === 'undefined') throw new Error(getCookieError('setCookie'))

  document.cookie = `${name}=${value}; path=/`
}

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') throw new Error(getCookieError('deleteCookie'))

  document.cookie = `${name}=; max-age=0; path=/`
}

export { getCookie, setCookie, deleteCookie }
