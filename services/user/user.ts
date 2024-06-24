import { env } from '../../constants/constants'

const API_URL = env.API_URL
class UserService {
  async setUserName(accessToken: string, name: string){
    const request = {
      name: name
    }
    const res = await fetch(`${API_URL}v1/user/name`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    if(res.status!=200){
      console.log("setUserName: error, status: ", res.status)
      console.log(res.json())
      return""
    }
    const data = await res.json()
    return data
  }
  async getUserInfo(accessToken: string, userId: string){
    const res = await fetch(`${API_URL}v1/user/info?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    })
    if(res.status!=200){
      console.log("getUserInfo: error, status: ", res.status)
      console.log(res.json())
      return""
    }
    const data = await res.json()
    return data
  }
}
export default new UserService()