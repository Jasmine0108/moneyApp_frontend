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
  async createGroup(name: string, accessToken: string){
    const res = await fetch(`${API_URL}v1/group`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name}),
    })
    const data = await res.json()
    return data
  }
  async listGroup(accessToken: string){
    const res = await fetch(`${API_URL}v1/group/joined`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
    return data
  }
  async deleteGroup(groupId: string, accessToken: string){
    const res = await fetch(`${API_URL}v1/group/${groupId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({groupId}),
    })
    const data = await res.json()
    return data
  }
  
}

export default new AuthService()
