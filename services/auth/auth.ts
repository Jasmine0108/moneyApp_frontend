import { env } from '../../constants/constants'

const API_URL = env.API_URL
class AuthService {
  async register(email: string, password: string) {
    const res = await fetch(`${API_URL}v1/user/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    return data
  }
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}v1/user/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    return data
  }
}

export default new AuthService()
