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

export default function groupContentScreen() {
  const [group, setGroup] = useState('')
  const [groupMembers, setGroupMembers] = useState<members[]>()
  const [myMemberId, setMyMemberId] = useState('')
  const [activeTab, setActiveTab] = useState('group')
  const [groupBalances, setGroupBalances] = useState<balances[]>()
  const [personTransfers, setPersonTransfers] = useState<transfers[]>()
  const router = useRouter()
  const isFocused = useIsFocused()
  const test = () => {
    console.log('groupBalances', groupBalances)
    console.log('personTransfers', personTransfers)
    console.log('myMemberId', myMemberId)
  }
  const findUserNameByMemberId = (memberId: string): string | null => {
    const member = groupMembers.find((m) => m.memberId === memberId)
    return member ? member.userName : null
  }
  const findMemberIdByUserId = (UserId: string, _members): string | null => {
    const _member = _members.find((m) => m.userId === UserId)
    return _member ? _member.memberId : null
  }
  const handleButtonClick = async () => {
    router.navigate('/group_content')
  }
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab)
  }
  function convertToBalances(_data) {
    const balancesArray: balances[] = []
    _data.forEach((value, key) => {
      balancesArray.push({
        id: key,
        balance: value,
      })
    })
    const sortedBalancesDesc = balancesArray.sort(
      (a, b) => b.balance - a.balance
    )
    //console.log('balances', sortedBalancesDesc)
    setGroupBalances(sortedBalancesDesc)
  }
  function convertToTransfers(_data) {
    //console.log(_data)
    var _transfer: transfers[] = [] // interface : from, to, amount
    var sorted_transfer: transfers[] = []
    var creditors: balances[] = [] // remittee
    var deditors: balances[] = [] // payer
    _data.forEach((value, key) => {
      if (value > 0)
        creditors.push({
          id: key,
          balance: value,
        })
      else
        deditors.push({
          id: key,
          balance: value,
        })
    })
    //console.log('creditors', creditors)
    //console.log('deditors', deditors)
    // from 1 to 1
    for (var i = 0; i < creditors.length; ++i) {
      for (var j = 0; j < deditors.length; ++j) {
        if (
          creditors[i].balance > 0 &&
          creditors[i].balance + deditors[j].balance == 0
        ) {
          _transfer.push({
            from: deditors[j].id,
            to: creditors[i].id,
            amount: creditors[i].balance,
          })
          creditors[i].balance = 0
          deditors[j].balance = 0
          break
        }
      }
    }
    // from 1 to 2
    for (var i = 0; i < creditors.length; ++i) {
      for (var j = 0; j < creditors.length; ++j) {
        for (var k = 0; k < deditors.length; ++k) {
          if (
            creditors[i].balance > 0 &&
            creditors[j].balance > 0 &&
            i != j &&
            creditors[i].balance + creditors[j].balance + deditors[k].balance ==
              0
          ) {
            _transfer.push({
              from: deditors[k].id,
              to: creditors[i].id,
              amount: creditors[i].balance,
            })
            _transfer.push({
              from: deditors[k].id,
              to: creditors[j].id,
              amount: creditors[j].balance,
            })

            deditors[k].balance = 0
            creditors[i].balance = 0
            creditors[j].balance = 0
          }
        }
      }
    }
    // from 2 to 1
    for (var i = 0; i < deditors.length; ++i) {
      for (var j = 0; j < deditors.length; ++j) {
        for (var k = 0; k < creditors.length; ++k) {
          if (
            deditors[i].balance < 0 &&
            deditors[j].balance < 0 &&
            i != j &&
            deditors[i].balance + deditors[j].balance + creditors[k].balance ==
              0
          ) {
            _transfer.push({
              from: deditors[i].id,
              to: creditors[k].id,
              amount: deditors[i].balance,
            })
            _transfer.push({
              from: deditors[j].id,
              to: creditors[k].id,
              amount: deditors[j].balance,
            })
            deditors[i].balance = 0
            deditors[j].balance = 0
            creditors[k].balance = 0
          }
        }
      }
    }
    var largest_credit: balances = { id: '-1', balance: -1 }
    for (var i = 0; i < creditors.length; ++i) {
      if (creditors[i].balance > largest_credit.balance) {
        largest_credit.balance = creditors[i].balance
        largest_credit.id = creditors[i].id
      }
    }
    for (var r = 0; r < creditors.length; ++r) {
      if (creditors[r].id != largest_credit.id && creditors[r].balance > 0) {
        _transfer.push({
          from: largest_credit.id,
          to: creditors[r].id,
          amount: creditors[r].balance,
        })
        largest_credit.balance += creditors[r].balance
        creditors[r].balance = 0
      }
    }
    for (var p = 0; p < deditors.length; ++p) {
      if (deditors[p].balance < 0) {
        _transfer.push({
          from: deditors[p].id,
          to: largest_credit.id,
          amount: -deditors[p].balance,
        })
        largest_credit.balance += deditors[p].balance
        deditors[p].balance = 0
      }
    }
    //console.log(my_transfer_from, 'my_transfer_from')
    //console.log(my_transfer_to, 'my_transfer_to')
    //console.log(other_transfer, 'other_transfer')
    var my_transfer_from: number[] = []
    var my_transfer_to: number[] = []
    var other_transfer: number[] = []
    for (var i = 0; i < _transfer.length; ++i) {
      if (_transfer[i].from == myMemberId) {
        my_transfer_from.push(i)
      } else if (_transfer[i].to == myMemberId) {
        my_transfer_to.push(i)
      } else {
        other_transfer.push(i)
      }
    }
    my_transfer_from = my_transfer_from.sort(
      (a, b) => _transfer[a].amount - _transfer[b].amount
    )
    my_transfer_to = my_transfer_to.sort(
      (a, b) => _transfer[b].amount - _transfer[a].amount
    )
    other_transfer = other_transfer.sort(
      (a, b) => _transfer[b].amount - _transfer[a].amount
    )

    other_transfer.forEach((index) => {
      sorted_transfer.push({
        from: _transfer[index].from,
        to: _transfer[index].to,
        amount: _transfer[index].amount,
      })
    })
    my_transfer_from.forEach((index) => {
      sorted_transfer.push({
        from: _transfer[index].from,
        to: _transfer[index].to,
        amount: _transfer[index].amount,
      })
    })
    my_transfer_to.forEach((index) => {
      sorted_transfer.push({
        from: _transfer[index].from,
        to: _transfer[index].to,
        amount: _transfer[index].amount,
      })
    })
    setPersonTransfers(sorted_transfer)
    // console.log('trasfer', sorted_transfer)
  }

  async function aggregatePrepaidAmounts(data) {
    const prepaidMap = new Map()
    for (let i = 0; i < data.length; i++) {
      const bill = data[i]
      //console.log('bill data[i]', bill)
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
    /*const testPrepaidMap = new Map()
    testPrepaidMap.set('person1', 200)
    testPrepaidMap.set('person2', 200)
    testPrepaidMap.set('person3', 200)
    testPrepaidMap.set('person4', -100)
    testPrepaidMap.set('person5', -300)
    testPrepaidMap.set('person6', -200)*/
    //console.log('prepaidMap', prepaidMap)
    await convertToBalances(prepaidMap)
    await convertToTransfers(prepaidMap)
  }
  React.useEffect(() => {
    const getBills = async () => {
      try {
        //var accessToken = await AsyncStorage.getItem('@accessToken')
        var group_res = await AsyncStorage.getItem('@currentGroup')
        const userId = await AsyncStorage.getItem('@userId')
        var _group = JSON.parse(group_res)

        setGroup(_group)

        var _bill_res = await AsyncStorage.getItem('@currentGroupBills')
        const bill_res: bills[] = JSON.parse(_bill_res)
        var _member_res = await AsyncStorage.getItem('@currentGroupMembers')
        const member_res: members[] = JSON.parse(_member_res)
        setMyMemberId(findMemberIdByUserId(userId, member_res))
        //todelet
        //console.log('bill_res', bill_res)
        //console.log('member_res', member_res)
        /*var test_member: members[] = [
          {
            memberId: 'person1',
            userId: 'person1',
            userName: 'person1_name',
            avatarUrl: '123',
          },
          {
            memberId: 'person2',
            userId: 'person2',
            userName: 'person2_name',
            avatarUrl: '23',
          },
          {
            memberId: 'person3',
            userId: 'person3',
            userName: 'person3_name',
            avatarUrl: '123',
          },
          {
            memberId: 'person4',
            userId: 'person4',
            userName: 'person4_name',
            avatarUrl: '223',
          },
          {
            memberId: 'person5',
            userId: 'person5',
            userName: 'person5_name',
            avatarUrl: '123',
          },
          {
            memberId: 'person6',
            userId: 'person6',
            userName: 'person6_name',
            avatarUrl: '23',
          },
        ]*/
        setGroupMembers(member_res)
        //todelete
        //console.log('bill_res', bill_res)
        await aggregatePrepaidAmounts(bill_res)
        //console.log('groupMembers', groupMembers)
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
                  {findUserNameByMemberId(groupBalances[index].id)}
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
                    {...(personTransfers[index].from == myMemberId
                      ? { color: '#AA2929' }
                      : {})}
                    {...(personTransfers[index].to == myMemberId
                      ? { color: '#10520E' }
                      : {})}
                  >
                    {findUserNameByMemberId(personTransfers[index].from)}
                  </SizableText>
                  <SizableText
                    fontWeight={400}
                    fontSize="20px"
                    {...(personTransfers[index].from == myMemberId
                      ? { color: '#AA2929' }
                      : {})}
                    {...(personTransfers[index].to == myMemberId
                      ? { color: '#10520E' }
                      : {})}
                  >
                    {' -> '}
                  </SizableText>
                  <SizableText
                    fontWeight={400}
                    fontSize="20px"
                    {...(personTransfers[index].from == myMemberId
                      ? { color: '#AA2929' }
                      : {})}
                    {...(personTransfers[index].to == myMemberId
                      ? { color: '#10520E' }
                      : {})}
                  >
                    {findUserNameByMemberId(personTransfers[index].to)}
                  </SizableText>
                </View>
                <View paddingHorizontal="20px">
                  <SizableText
                    fontWeight={400}
                    fontSize="20px"
                    {...(personTransfers[index].from == myMemberId
                      ? { color: '#AA2929' }
                      : {})}
                    {...(personTransfers[index].to == myMemberId
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
        <Button onPress={test}>test</Button>
      </View>
    </View>
  )
}
