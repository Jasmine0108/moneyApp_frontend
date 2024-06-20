import React from 'react'
import { View, Button, Dialog, XStack, YStack } from 'tamagui'
import { Link } from 'expo-router'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'
import AuthService from '../services/auth/auth'
import GroupService from '../services/group/group'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'

export default function groupContentScreen() {
  const [groupName, setGroupName] = React.useState('')
  const [accessToken, setAccessToken] = React.useState('')
  const [groupId, setGroupId] = React.useState('')
  const [bills, setBills] = React.useState('')

  const router = useRouter()
  const isFocused = useIsFocused()
  const handleInsertBill = async () => {
    //console.log('userId:', await AsyncStorage.getItem('@userId'))
    try {
      var obj = {
        totalMoney: 33,
        title: 'test_062001',
        description: 'test_062001_description',
        prepaidPeople: [
          { memberId: 'a5473f1c-547a-4ffb-8a81-493f2a5e1dc6', amount: 33 },
        ],
        splitPeople: [
          { memberId: 'a5473f1c-547a-4ffb-8a81-493f2a5e1dc6', amount: 33 },
        ],
      }
      GroupService.modifyBills(
        accessToken,
        '3949e5db-5b62-48a9-9d5e-ce7fb633bf10',
        obj
      )
    } catch (e) {
      console.log(e)
    }
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
      console.log('res_info', res)
      setGroupName(res.name)
    }
    if (isFocused) getGroupInfo()
  }, [isFocused])
  React.useEffect(() => {
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
      console.log('bill_info', res)
      setBills(res)
    }
    if (isFocused) getBills()
    console.log(bills)
  }, [isFocused])

  return (
    <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>
      <Link href="/group">return</Link>
      <Link href="/group_balance">結餘</Link>
      <Button onPress={() => handleInsertBill()}>test</Button>
    </View>
  )
}
