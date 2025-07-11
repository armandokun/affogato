import { getCookie, setCookie, deleteCookie } from './cookie'

describe('cookie.ts', () => {
  beforeEach(() => {
    document.cookie = ''
  })

  describe('getCookie', () => {
    it('should return null when cookie does not exist', () => {
      expect(getCookie('nonexistent')).toBeNull()
    })

    it('should return cookie value when cookie exists', () => {
      document.cookie = 'test=value; path=/'
      expect(getCookie('test')).toBe('value')
    })

    it('should handle multiple cookies', () => {
      document.cookie = 'first=one; path=/'
      document.cookie = 'second=two; path=/'
      expect(getCookie('first')).toBe('one')
      expect(getCookie('second')).toBe('two')
    })
  })

  describe('setCookie', () => {
    it('should set a cookie with the given name and value', () => {
      setCookie('test', 'value')
      expect(document.cookie).toContain('test=value')
    })

    it('should update existing cookie value', () => {
      setCookie('test', 'first')
      setCookie('test', 'second')
      expect(getCookie('test')).toBe('second')
    })
  })

  describe('deleteCookie', () => {
    it('should delete an existing cookie', () => {
      setCookie('test', 'value')
      expect(getCookie('test')).toBe('value')

      deleteCookie('test')
      expect(getCookie('test')).toBeNull()
    })

    it('should not throw error when deleting non-existent cookie', () => {
      expect(() => deleteCookie('nonexistent')).not.toThrow()
    })
  })
})
