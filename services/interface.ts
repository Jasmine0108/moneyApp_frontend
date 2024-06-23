export interface PrepaidPerson {
    memberId: string
    amount: number
    username: string
}
  
export  interface SplitPerson {
    memberId: string
    amount: number
    username: string
}
  
export interface Bill {
    billId: string
    groupId: string
    totalMoney: number
    title: string
    description: string
    prepaidPeople: PrepaidPerson[]
    splitPeople: SplitPerson[]
}
export  interface CurrentGroup {
    groupId: string
    name: string
    description: string
    avatarUrl: string
}
  
export interface User {
    id: string
    name: string
}

export interface Member {
    memberId: string
    userId: string
    userName: string
    avatarUrl: any
  }
  