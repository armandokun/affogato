const constructUrlWithParams = (url: string, params: Record<string, string | undefined>) => {
  const urlObj = new URL(url)

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      urlObj.searchParams.set(key, value)
    }
  })

  return urlObj.toString()
}

export { constructUrlWithParams }
