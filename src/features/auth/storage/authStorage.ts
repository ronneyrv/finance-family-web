const ACCESS_TOKEN_KEY = 'finance-family.access-token'
const REFRESH_TOKEN_KEY = 'finance-family.refresh-token'

export const authStorage = {
  getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setAccessToken(accessToken: string) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  },

  removeAccessToken() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken(refreshToken: string) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  removeRefreshToken() {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  clear() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
