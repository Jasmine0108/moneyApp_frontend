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
  async getGroupInfo(accessToken: string, groupId: string){
    const res = await fetch(`${API_URL}v1/group?groupId=${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
    return data
  }
  async setGroupInviteCode(accessToken: string, groupId: string){
    const res = await fetch(`${API_URL}v1/group/invite-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({groupId}),
    })
    const data = await res.json()
    return data
  }
  /*
  async getGroupInviteCode(accessToken: string, groupId: string){
    const res = await fetch(`${API_URL}v1/group/invite-code/g2i?groupId=${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
    return data
  }*/
    async joinGroup(accessToken: string, inviteCode: string){
      const res = await fetch(`${API_URL}v1/group/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({inviteCode}),
      })
      const data = await res.json()
      return data
    }
    async listGroupMember(accessToken: string, groupId: string){
      const res = await fetch(`${API_URL}v1/group/members?groupId=${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      console.log('data', data)
      return data
    }


  
}

export default new AuthService()