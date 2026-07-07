const ACCESS_TOKEN_KEY = 'finance-family.access-token'

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
}
