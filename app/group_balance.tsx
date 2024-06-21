import React from 'react'
import { View, Button, SizableText, Tabs } from 'tamagui'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import AuthService from '../services/auth/auth'
import GroupService from '../services/group/group'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { useState } from 'react'

interface members {
  memberId: string
  userId: string
  userName: string
  avatarUrl: any
}

interface balances {
  id: string
  balance: number
}

interface transfers {
  from: string
  to: string
  amount: number
}
interface prepaidPerson {
  memberId: string
  amount: number
  username: string
}

interface splitPerson {
  memberId: string
  amount: number
  username: string
}

interface bills {
  billId: string
  groupId: string
  totalMoney: number
  title: string
  description: string
  prepaidPeople: prepaidPerson[]
  splitPeople: splitPerson[]
}

const exampleBalances: balances[] = [
  { id: 'User2', balance: 500 },
  { id: 'User1', balance: 800 },
  { id: 'User5', balance: -500 },
  { id: 'User4', balance: -800 },
  { id: 'User3', balance: 200 },
]
const exampleTransfer: transfers[] = [
  { from: 'User1', to: 'User1', amount: 800 },
  { from: 'User2', to: 'User1', amount: 500 },
  { from: 'User3', to: 'User1', amount: 200 },
  { from: 'User4', to: 'User1', amount: 800 },
  { from: 'User5', to: 'User2', amount: 500 },
]

export default function groupContentScreen() {
  const [groupName, setGroupName] = useState('')
  //const [groupMembers, setGroupMembers] = useState<members[]>([])
  const [myUserName, setMyUserName] = useState('User2')
  const [activeTab, setActiveTab] = useState('group')
  const [groupBalances, setGroupBalances] =
    useState<balances[]>(exampleBalances)
  const [personTransfers, setPersonTransfers] =
    useState<transfers[]>(exampleTransfer)
  const router = useRouter()
  const isFocused = useIsFocused()

  const handleButtonClick = async () => {
    //console.log('groupMembers', groupMembers)
    router.navigate('/group_content')
  }
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab)
  }
  function convertToBalances(_data, member: members[]) {
    //console.log('test', member.length)
    const balancesArray: balances[] = []
    _data.forEach((value, key) => {
      balancesArray.push({
        id: member.find((m) => m.memberId === key).userName,
        balance: value,
      })
    })
    const sortedBalancesDesc = balancesArray.sort(
      (a, b) => b.balance - a.balance
    )
    console.log('balances', sortedBalancesDesc)
    setGroupBalances(sortedBalancesDesc)
  }
  function convertToTransfers(_data, member) {}

  async function aggregatePrepaidAmounts(_data, member) {
    const data = _data['groupBills']
    const prepaidMap = new Map()
    for (let i = 0; i < data.length; i++) {
      const bill = data[i]
      for (let j = 0; j < bill.prepaidPeople.length; j++) {
        const person = bill.prepaidPeople[j]
        if (prepaidMap.has(person.memberId)) {
          prepaidMap.set(
            person.memberId,
            prepaidMap.get(person.memberId) + person.amount
          )
        } else {
          prepaidMap.set(person.memberId, person.amount)
        }
      }
      for (let j = 0; j < bill.splitPeople.length; j++) {
        const person = bill.splitPeople[j]
        if (prepaidMap.has(person.memberId)) {
          prepaidMap.set(
            person.memberId,
            prepaidMap.get(person.memberId) - person.amount
          )
        } else {
          prepaidMap.set(person.memberId, -person.amount)
        }
      }
    }
    await convertToBalances(prepaidMap, member)
    await convertToTransfers(prepaidMap, member)
  }
  React.useEffect(() => {
    const getBills = async () => {
      try {
        var accessToken = await AsyncStorage.getItem('@accessToken')
        var groupId = await AsyncStorage.getItem('@currentGroupId')
        var group_res = await AuthService.getGroupInfo(accessToken, groupId)
        setGroupName(group_res)
        const bill_res: bills[] = await GroupService.getBills(
          accessToken,
          groupId
        )
        var member_res = await AuthService.listGroupMember(accessToken, groupId)

        await aggregatePrepaidAmounts(bill_res, member_res['members'])
      } catch (e) {
        console.log(e)
      }
    }
    if (isFocused) {
      getBills()
    }
  }, [isFocused])
  return (
    <View
      bg={Colors.bg}
      alignItems="center"
      height="100%"
      justifyContent="center"
    >
      <Tabs
        defaultValue="group"
        width="100%"
        flexDirection="column"
        paddingHorizontal="35px"
      >
        <Tabs.List>
          <Tabs.Tab
            value="group"
            flex={1}
            borderWidth="0px"
            borderTopLeftRadius="20px"
            borderBottomLeftRadius="0px"
            borderBottomRightRadius="0px"
            borderTopRightRadius="20px"
            onPress={() => handleTabSwitch('group')}
            {...(activeTab === 'group'
              ? { background: '#E0DDD6' }
              : {
                  background: '#FAFAF4',
                  borderColor: '#E0DDD6',
                  borderWidth: '$-10',
                })}
          >
            <SizableText>群組帳務</SizableText>
          </Tabs.Tab>
          <Tabs.Tab
            value="person"
            flex={1}
            background={Colors.primary}
            borderWidth="0px"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
            borderBottomLeftRadius="0px"
            borderBottomRightRadius="0px"
            onPress={() => handleTabSwitch('person')}
            {...(activeTab === 'person'
              ? { background: '#E0DDD6' }
              : {
                  background: '#FAFAF4',
                  borderColor: '#E0DDD6',
                  borderWidth: '$-10',
                })}
          >
            <SizableText>個人帳務</SizableText>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="group">
          {groupBalances &&
            Object.keys(groupBalances).map((i, index) => (
              <View
                height="52px"
                width="100%"
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
                borderRightWidth="$-0.25"
                borderLeftWidth="$-0.25"
                borderColor="#E0DDD6"
                {...(index % 2 == 0
                  ? { backgroundColor: '#FFFFFF' }
                  : {
                      backgroundColor: '#E0DDD6',
                    })}
                {...(groupBalances.length - 1 == index
                  ? {
                      borderBottomLeftRadius: '20px',
                      borderBottomRightRadius: '20px',
                      borderBottomWidth: '$-0.25',
                    }
                  : {})}
              >
                <SizableText
                  fontWeight={400}
                  fontSize="20px"
                  {...(groupBalances[index].balance < 0
                    ? { color: '#AA2929' }
                    : {
                        color: '#10520E',
                      })}
                >
                  {groupBalances[index].id}
                </SizableText>
                <SizableText
                  fontWeight={400}
                  fontSize="20px"
                  {...(groupBalances[index].balance < 0
                    ? { color: '#AA2929' }
                    : {
                        color: '#10520E',
                      })}
                >
                  {groupBalances[index].balance}
                </SizableText>
              </View>
            ))}
        </Tabs.Content>
        <Tabs.Content value="person">
          {personTransfers &&
            Object.keys(personTransfers).map((i, index) => (
              <View
                height="52px"
                width="100%"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                borderRightWidth="$-0.25"
                borderLeftWidth="$-0.25"
                borderColor="#E0DDD6"
                {...(index % 2 == 0
                  ? { backgroundColor: '#FFFFFF' }
                  : {
                      backgroundColor: '#E0DDD6',
                    })}
                {...(personTransfers.length - 1 == index
                  ? {
                      borderBottomLeftRadius: '20px',
                      borderBottomRightRadius: '20px',
                      borderBottomWidth: '$-0.25',
                    }
                  : {})}
              >
                <View flexDirection="row" paddingHorizontal="20px">
                  <SizableText
                    fontWeight={400}
                    fontSize="20px"
                    color="#545454"
                    {...(personTransfers[index].from == myUserName
                      ? { color: '#AA2929' }
                      : {})}
                    {...(personTransfers[index].to == myUserName
                      ? { color: '#10520E' }
                      : {})}
                  >
                    {personTransfers[index].from}
                  </SizableText>
                  <SizableText
                    fontWeight={400}
                    fontSize="20px"
                    {...(personTransfers[index].from == myUserName
                      ? { color: '#AA2929' }
                      : {})}
                    {...(personTransfers[index].to == myUserName
                      ? { color: '#10520E' }
                      : {})}
                  >
                    {' -> '}
                  </SizableText>
                  <SizableText
                    fontWeight={400}
                    fontSize="20px"
                    {...(personTransfers[index].from == myUserName
                      ? { color: '#AA2929' }
                      : {})}
                    {...(personTransfers[index].to == myUserName
                      ? { color: '#10520E' }
                      : {})}
                  >
                    {personTransfers[index].to}
                  </SizableText>
                </View>
                <View paddingHorizontal="20px">
                  <SizableText
                    fontWeight={400}
                    fontSize="20px"
                    {...(personTransfers[index].from == myUserName
                      ? { color: '#AA2929' }
                      : {})}
                    {...(personTransfers[index].to == myUserName
                      ? { color: '#10520E' }
                      : {})}
                  >
                    {personTransfers[index].amount}
                  </SizableText>
                </View>
              </View>
            ))}
        </Tabs.Content>
      </Tabs>
      <View alignItems="center" justifyContent="center" paddingTop="50px">
        <Button onPress={() => handleButtonClick()}>確定</Button>
      </View>
    </View>
  )
}
