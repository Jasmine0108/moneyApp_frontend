import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { Colors } from '../constants/Colors'
import { useRouter, Link } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import AuthService from '../services/auth/auth'
import GroupService from '../services/group/group'
import { ScrollView, View, Text, Input } from 'tamagui'
import { Button, styled } from 'tamagui'
import MultiSelect from 'react-native-multiple-select'
import {
  PrepaidPerson,
  SplitPerson,
  Bill,
  User,
  Member,
  CurrentGroup,
} from '../services/interface'

const ShadowView = styled(View, {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  margin: 20,
})

export default function groupContentScreen() {
  ////////////////////////////////////////////////////////////////////////////useState
  //insertion
  const [payer, setPayer] = useState<PrepaidPerson[]>([])
  const [participants, setParticipants] = useState([])
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  //component state
  const [showDatePicker, setShowDatePicker] = useState(false)
  //database
  const [accessToken, setAccessToken] = React.useState('')
  const [group, setGroup] = React.useState<CurrentGroup>()
  const [members, setMember] = useState<Member[]>([])
  const isFocused = useIsFocused()
  const router = useRouter()
  ////////////////////////////////////////////////////////////////////////////function
  //component event
  const handleCancelButton = () => {
    router.navigate('/group_content')
  }
  const onDatechange = (event, selectedDate) => {
    setShowDatePicker(false)
    setDate(selectedDate)
  }
  const datePickerOnPress = () => {
    setShowDatePicker(true)
  }
  const snapshotForMultiSelection = async (type: string) => {
    try {
      await AsyncStorage.setItem('@snapshotItemModify', item)
      await AsyncStorage.setItem('@snapshotAmountModify', amount)
      console.log('amount', amount)
      if (type == 'participants') {
        await AsyncStorage.setItem(
          '@snapshotPayerModify',
          JSON.stringify(payer)
        )
        await AsyncStorage.setItem('@snapshotParticipantsModify', '')
      } else {
        await AsyncStorage.setItem('@snapshotPayerModify', '')
        await AsyncStorage.setItem(
          '@snapshotParticipantsModify',
          JSON.stringify(participants)
        )
      }
      await AsyncStorage.setItem('@fromPageModify', type)
    } catch (e) {
      console.log(e)
      return false
    }
    return true
  }
  const handleMultiplePayer = async () => {
    var isSuccess = await snapshotForMultiSelection('payer')
    if (isSuccess) {
      router.push('/modify_multi')
    }
  }
  const handleMultipleParticipant = async () => {
    var isSuccess = await snapshotForMultiSelection('participants')
    if (isSuccess) {
      router.push('/modify_multi')
    }
  }

  const handleEditRecord = async () => {
    try {
      const modifyBillId = await AsyncStorage.getItem('@currentBillIdModify')
      const newRecord = {
        totalMoney: amount,
        title: item,
        description: 'description',
        prepaidPeople: payer.map((person) => ({
          memberId: person.memberId,
          amount: person.amount,
        })),
        splitPeople: participants.map((person) => ({
          memberId: person.memberId,
          amount: person.amount,
        })),
      }
      // Assuming GroupService.insertBills is an async function that inserts bills
      console.log('on confirm button pressed, data sent to backend: ')
      console.log('accessToken', accessToken)
      console.log('billID', modifyBillId)
      console.log('newRecord', newRecord)
      await GroupService.modifyBills(accessToken, modifyBillId, newRecord)
      router.navigate('/group_content')
      //console.log('billID', billID)
      //setChanged(true)
    } catch (error) {
      console.error('Error deleting record:', error)
    }
  }
  //function
  const formatDate = (date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  //test
  const test = async () => {
    const modifyBillId = await AsyncStorage.getItem('@currentBillIdModify')
    console.log('modifyBillId', modifyBillId)
    console.log('payer', payer)
    console.log('participants', participants)
    console.log('item', item)
    console.log('amount', amount)
  }

  React.useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const _accessToken = await AsyncStorage.getItem('@accessToken')
        const JSON_group = await AsyncStorage.getItem('@currentGroup')
        const userId = await AsyncStorage.getItem('@userId')
        // console.log('@userid', userId)
        setAccessToken(_accessToken)
        const _group = JSON.parse(JSON_group)
        setGroup(_group)

        const member_res = await GroupService.getGroupMember(
          _accessToken,
          _group.groupId
        )

        //console.log('_group._accessToken', _accessToken)

        setMember(member_res.members) // member_res.members 是包含 id 和 name 属性的数组
        setPayer([])
        setParticipants([])
        setItem('')
        setAmount('')
        //console.log('history_res', history_res)

        var _fromPage = await AsyncStorage.getItem('@fromPageModify')
        if (_fromPage == 'payer' || _fromPage == 'participants') {
          var snapshotItem = await AsyncStorage.getItem('@snapshotItemModify')
          var snapshotAmount = await AsyncStorage.getItem(
            '@snapshotAmountModify'
          )
          var snapshotPayer = await AsyncStorage.getItem('@snapshotPayerModify')
          var snapshotParticipants = await AsyncStorage.getItem(
            '@snapshotParticipantsModify'
          )
          var check_sumResponseModify = await AsyncStorage.getItem(
            '@check_sumResponseModify'
          )
          //console.log('check_sumResponseModify', check_sumResponseModify)
          setItem(snapshotItem)
          setAmount(snapshotAmount)
          if (_fromPage == 'payer') {
            //console.log('check_sumResponse', check_sumResponseModify)
            if (check_sumResponseModify != '') {
              setPayer(JSON.parse(check_sumResponseModify))
            } else {
              setPayer([])
            }
            setParticipants(JSON.parse(snapshotParticipants))
          }
          if (_fromPage == 'participants') {
            // console.log('check_sumResponse', check_sumResponseModify)
            setPayer(JSON.parse(snapshotPayer))
            if (check_sumResponseModify != '') {
              setParticipants(JSON.parse(check_sumResponseModify))
            } else {
              setParticipants([])
            }
          }
        }

        await AsyncStorage.setItem('@fromPageModify', '')
        await AsyncStorage.setItem('@snapshotItemModify', '')
        await AsyncStorage.setItem('@snapshotAmountModify', '')
        await AsyncStorage.setItem('@snapshotPayerModify', '')
        await AsyncStorage.setItem('@snapshotParticipantsModify', '')
        await AsyncStorage.setItem('@check_sumResponseModify', '')
      } catch (e) {
        console.log(e)
      }
    }
    if (isFocused) {
      getGroupInfo()
    }
  }, [isFocused])

  return (
    <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F5F5F5', width: '100%' }}
      >
        <View
          flex={1}
          justifyContent="center"
          alignItems="center"
          paddingVertical="20px"
        >
          {/* insert */}
          <ShadowView
            style={{
              height: '450px',
              backgroundColor: '#E0DDD6',
              justifyContent: 'center',
              alignItems: 'center',
              width: '80%',
              borderRadius: 10,
              paddingVertical: 20,
              marginBottom: 20,
            }}
          >
            {/* 品項 */}
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Feather name="clipboard" size={20} style={{ marginRight: 10 }} />
              <Input
                color={'black'}
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  textAlign: 'left',
                  paddingVertical: 10,
                  borderRadius: 5,
                }}
                placeholder="品項"
                placeholderTextColor="black"
                value={item}
                onChangeText={setItem}
              />
            </View>
            {/* 金額 */}
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Feather
                name="dollar-sign"
                size={20}
                style={{ marginRight: 10 }}
              />
              <Input
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  textAlign: 'left',
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: 'white',
                  color: 'black',
                }}
                placeholder="金額"
                placeholderTextColor="black"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* 付款人 */}
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Feather name="users" size={20} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }} flexDirection="row">
                <View width="61%">
                  <MultiSelect
                    hideTags
                    submitButtonText="confirm"
                    items={members}
                    uniqueKey="id"
                    displayKey="name"
                    selectedItems={payer}
                    onSelectedItemsChange={setPayer}
                    onToggleList={() => null}
                    selectText="  付款人"
                    styleDropdownMenu={{ backgroundColor: 'white' }}
                    searchInputStyle={{ height: 0 }} // This hides the search input by reducing its height to zero
                    customSearchInputStyle={{ height: 0 }} // Ensuring the custom search input style also hides the input
                    searchIcon={() => null} // This renders nothing for the search icon
                    styleMainWrapper={{
                      backgroundColor: 'white',
                      borderRadius: 5,
                      paddingHorizontal: 12,
                    }}
                  />
                </View>
                <Button width="39%" onPress={handleMultiplePayer}>
                  選擇多人
                </Button>
              </View>
            </View>

            {/* 分帳者 */}
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Feather name="users" size={20} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }} borderRadius="20px" flexDirection="row">
                <View width="61%">
                  <MultiSelect
                    hideTags
                    items={members}
                    uniqueKey="id"
                    displayKey="name"
                    submitButtonText="confirm"
                    selectedItems={participants}
                    onSelectedItemsChange={setParticipants}
                    selectText="  分帳者"
                    styleDropdownMenu={{ backgroundColor: 'white' }}
                    searchInputStyle={{ height: 0 }} // This hides the search input by reducing its height to zero
                    customSearchInputStyle={{ height: 0 }} // Ensuring the custom search input style also hides the input
                    searchIcon={() => null}
                    styleMainWrapper={{
                      backgroundColor: 'white',
                      borderRadius: 5,
                      paddingHorizontal: 12,
                    }}
                  />
                </View>

                <Button onPress={handleMultipleParticipant}>選擇多人</Button>
              </View>
            </View>

            {/* 日期 */}
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="calendar" size={20} style={{ marginRight: 10 }} />
              <Button
                themeInverse
                onPress={datePickerOnPress}
                style={{ flex: 1, color: 'F2EEE5' }}
              >
                <Text>{formatDate(date)}</Text>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    onChange={onDatechange}
                  />
                )}
              </Button>
            </View>
            {/*Button*/}
            <View style={{ marginTop: 20 }} flexDirection="row">
              <Button
                width={100}
                onPress={() => handleEditRecord()}
                style={{
                  color: 'F2EEE5',
                  borderRadius: 40,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                確定
              </Button>
              <Button
                width={100}
                onPress={handleCancelButton}
                style={{
                  color: 'F2EEE5',
                  borderRadius: 40,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                取消
              </Button>
            </View>
          </ShadowView>
        </View>

        <View flexDirection="row" width="100%" justifyContent="center"></View>
        {/*todelete*/}
        <Button onPress={test}>test</Button>
      </ScrollView>
    </View>
  )
}
