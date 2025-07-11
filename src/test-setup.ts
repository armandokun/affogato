let mockCookies: string[] = []

Object.defineProperty(global, 'document', {
  value: {
    cookie: '',
  },
  writable: true,
})

Object.defineProperty(global, 'window', {
  value: {
    location: {
      hostname: 'affogato.test',
      href: 'http://affogato.test',
      origin: 'http://affogato.test',
    },
  },
  writable: true,
})

Object.defineProperty(document, 'cookie', {
  get: () => mockCookies.join('; '),
  set: (value: string) => {
    if (value.includes('max-age=0') || value.includes('expires=')) {
      // Remove cookie (deletion)
      const name = value.split('=')[0]
      mockCookies = mockCookies.filter(cookie => !cookie.startsWith(name + '='))
    } else {
      // Add or update cookie
      const name = value.split('=')[0]
      mockCookies = mockCookies.filter(cookie => !cookie.startsWith(name + '='))
      mockCookies.push(value.split(';')[0]) // Only keep name=value part
    }
  },
})
