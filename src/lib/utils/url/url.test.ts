import { constructUrlWithParams } from './url'

describe('constructUrlWithParams', () => {
  it('should add params to url correctly', () => {
    const baseUrl = 'https://example.com'
    const params = {
      param1: 'value1',
      param2: 'value2'
    }

    const result = constructUrlWithParams(baseUrl, params)

    expect(result).toBe('https://example.com/?param1=value1&param2=value2')
  })

  it('should handle urls with existing params', () => {
    const baseUrl = 'https://example.com/?existing=true'
    const params = {
      param1: 'value1'
    }

    const result = constructUrlWithParams(baseUrl, params)

    expect(result).toBe('https://example.com/?existing=true&param1=value1')
  })

  it('should handle empty params object', () => {
    const baseUrl = 'https://example.com'
    const params = {}

    const result = constructUrlWithParams(baseUrl, params)

    expect(result).toBe('https://example.com/')
  })

  it('should encode special characters in params', () => {
    const baseUrl = 'https://example.com'
    const params = {
      'special char': 'value with spaces',
      'symbols': '!@#$%'
    }

    const result = constructUrlWithParams(baseUrl, params)

    expect(result).toBe('https://example.com/?special+char=value+with+spaces&symbols=%21%40%23%24%25')
  })
})
