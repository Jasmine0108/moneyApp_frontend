import React from 'react'
import {
  View,
  Button,
  Dialog,
  XStack,
  YStack,
  SizableText,
  Tabs,
} from 'tamagui'
import { Link } from 'expo-router'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'
import AuthService from '../services/auth/auth'
import GroupService from '../services/group/group'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { useState } from 'react'

interface balances {
  name: string
  balance: number
}

interface transfers {
  from: string
  to: string
  amount: number
}

const exampleBalances: balances[] = [
  { name: 'User1', balance: 800 },
  { name: 'User2', balance: 500 },
  { name: 'User3', balance: 200 },
  { name: 'User4', balance: -800 },
  { name: 'User5', balance: -500 },
  { name: 'User6', balance: -200 },
]
const exampleTransfer: transfers[] = [
  { from: 'User1', to: 'User1', amount: 800 },
  { from: 'User2', to: 'User1', amount: 500 },
  { from: 'User3', to: 'User1', amount: 200 },
  { from: 'User4', to: 'User1', amount: 800 },
  { from: 'User5', to: 'User2', amount: 500 },
  { from: 'User6', to: 'User1', amount: 200 },
]
export default function groupContentScreen() {
  const [groupName, setGroupName] = useState('')
  const [myUserName, setMyUserName] = useState('User2')
  const [accessToken, setAccessToken] = useState('')
  const [groupId, setGroupId] = useState('')
  const [bills, setBills] = useState('')
  const [activeTab, setActiveTab] = useState('group')
  const [groupBalances, setGroupBalances] =
    useState<balances[]>(exampleBalances)
  const [personTransfers, setPersonTransfers] =
    useState<transfers[]>(exampleTransfer)
  const router = useRouter()
  const isFocused = useIsFocused()
  const handleButtonClick = async (action: string) => {
    router.navigate('/group_content')
  }
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab)
  }

  React.useEffect(() => {
    const getGroupInfo = async () => {
      try {
        var accessToken = await AsyncStorage.getItem('@accessToken')
        var groupId = await AsyncStorage.getItem('@currentGroupId')
        setAccessToken(accessToken)
        setGroupId(groupId)
      } catch (e) {
        console.log(e)
      }
      var res = await AuthService.getGroupInfo(accessToken, groupId)
      //console.log('res_info', res)
      setGroupName(res.name)
    }
    const getBills = async () => {
      try {
        var accessToken = await AsyncStorage.getItem('@accessToken')
        var groupId = await AsyncStorage.getItem('@currentGroupId')
        setAccessToken(accessToken)
        setGroupId(groupId)
      } catch (e) {
        console.log(e)
      }
      var res = await GroupService.getBills(accessToken, groupId)
      //console.log('bill_info', res)
      setBills(res)
    }
    if (isFocused) {
      getGroupInfo()
      getBills()
    }
    console.log('bills:', bills)
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
                {...(index % 2 == 0
                  ? { backgroundColor: '#FFFFFF' }
                  : {
                      backgroundColor: '#E0DDD6',
                    })}
                {...(groupBalances.length - 1 == index
                  ? {
                      borderBottomLeftRadius: '20px',
                      borderBottomRightRadius: '20px',
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
                  {groupBalances[index].name}
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
                {...(index % 2 == 0
                  ? { backgroundColor: '#FFFFFF' }
                  : {
                      backgroundColor: '#E0DDD6',
                    })}
                {...(personTransfers.length - 1 == index
                  ? {
                      borderBottomLeftRadius: '20px',
                      borderBottomRightRadius: '20px',
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
        <Button onPress={() => handleButtonClick('confirm')}>確定</Button>
      </View>
    </View>
  )
}
