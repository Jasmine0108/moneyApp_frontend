import { env } from '../../constants/constants'

const API_URL = env.API_URL
class GroupService {
  async insertBills(accessToken: string, billObject){
    //console.log("accessToken", accessToken)
    //console.log("groupId", groupId)
    //console.log("billObject", billObject)
    const res = await fetch(`${API_URL}v1/groups_bill`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(billObject)
    })
    if(res.status!=200){
        console.log("insertBills: error, status: ", res.status)
        console.log(res.json())
        console.log("res", res)
        return""
      }
    const data = await res.json()
    return data
  }
  async getBills(accessToken: string, groupId: string){
    const res = await fetch(`${API_URL}v1/groups_bill?groupId=${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      if(res.status!=200){
        console.log("getBills: error, status: ", res.status)
        console.log(res.json())
        return""
      }
      const data = await res.json()
      //console.log("bill: ", data)
      return data
  }
  async modifyBills(accessToken: string, billId: string, newBillObject){
      const res = await fetch(`${API_URL}v1/groups_bill/${billId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBillObject)
      })
      if(res.status!=200){
        console.log("putBills: error, status: ", res.status)
        console.log(res.json())
        return""
      }
      const data = await res.json()
      return data
  }

  async deleteBills(accessToken: string, billId: string){
    const res = await fetch(`${API_URL}v1/groups_bill/${billId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    })
    if(res.status!=200){
      console.log("deleteBills: error, status: ", res.status)
      console.log(res.json())
      return""
    }
    const data = await res.json()
    return data
}
  async getGroupMember(accessToken: string, groupId: string){
    const res = await fetch(`${API_URL}v1/group/members?groupId=${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      return data
  }
  async getBillsHistory(accessToken: string, groupId: string){
    const res = await fetch(`${API_URL}v1/groups_bill/history?skip=0&limit=10&groupId=${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      if(res.status!=200){
        console.log("getBillsHistory: error, status: ", res.status)
        console.log(await res.json())
        return""
      }
      const data = await res.json()
      //console.log("bill: ", data)
      return data
  }
}
export default new GroupService()