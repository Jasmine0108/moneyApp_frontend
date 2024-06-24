import React, { useState } from 'react'
import { Alert } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { Colors } from '../constants/Colors'
import { useRouter, Link } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { Feather } from '@expo/vector-icons'
import AuthService from '../services/auth/auth'
import GroupService from '../services/group/group'
import { ScrollView, View, Text, Input, AlertDialogAction } from 'tamagui'
import { Button, styled, XStack, YStack, Dialog, Group, Overlay } from 'tamagui'
import MultiSelect from 'react-native-multiple-select'
import {
  PrepaidPerson,
  SplitPerson,
  Bill,
  User,
  Member,
  CurrentGroup,
} from '../services/interface'
import { mergeIfNotShallowEqual } from '@tamagui/core'

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

const exampleHistory = [
  {
    type: 'create',
    operatorName: 'string',
    title: 'item1',
    timestamp: '2024-06-23T13:45:28.116Z',
  },
  {
    type: 'delete',
    operatorName: 'string',
    title: 'item2',
    timestamp: '2024-06-24T13:45:28.116Z',
  },
  {
    type: 'create',
    operatorName: 'string',
    title: 'item3',
    timestamp: '2024-06-25T13:45:28.116Z',
  },
  {
    type: 'create',
    operatorName: 'string',
    title: 'item4',
    timestamp: '2024-06-26T13:45:28.116Z',
  },
  {
    type: 'modify',
    operatorName: 'string',
    title: 'item5',
    timestamp: '2024-06-27T13:45:28.116Z',
  },
]

export default function groupContentScreen() {
  ////////////////////////////////////////////////////////////////////////////useState
  //insertion
  const [payer, setPayer] = useState<PrepaidPerson[]>([])
  const [participants, setParticipants] = useState([])
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  //component state
  const [records, setRecords] = useState([])
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState(null)
  const [groupInfoChanged, setChanged] = React.useState(false)
  //database
  const [accessToken, setAccessToken] = React.useState('')
  const [inviteCode, setInviteCode] = React.useState('')
  const [groupBills, setGroupBills] = React.useState<Bill[]>([])
  const [billsHistory, setBillsHistory] = React.useState([])
  const [group, setGroup] = React.useState<CurrentGroup>()
  const [members, setMember] = useState<Member[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [myBalance, setMyBalance] = useState(0)
  const isFocused = useIsFocused()
  const router = useRouter()

  const [isListVisible, setIsListVisible] = useState(false)
  ////////////////////////////////////////////////////////////////////////////function
  //component event
  const onDatechange = (event, selectedDate) => {
    setShowDatePicker(false)
    setDate(selectedDate)
  }
  const datePickerOnPress = () => {
    setShowDatePicker(true)
  }
  const onpressList = () => {
    //alert('press list!, WIP')
    setIsListVisible(true)
  }

  const onpressSort = () => {
    alert('press sort, WIP')
  }
  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(inviteCode)
    } catch (e) {
      console.log(e)
    }
  }
  const snapshotForMultiSelection = async (type: string) => {
    try {
      await AsyncStorage.setItem('@snapshotItem', item)
      await AsyncStorage.setItem('@snapshotAmount', amount)
      if (type == 'participants') {
        await AsyncStorage.setItem('@snapshotPayer', JSON.stringify(payer))
        await AsyncStorage.setItem('@snapshotParticipants', '')
      } else {
        await AsyncStorage.setItem('@snapshotPayer', '')
        await AsyncStorage.setItem(
          '@snapshotParticipants',
          JSON.stringify(participants)
        )
      }
      await AsyncStorage.setItem('@fromPage', type)
    } catch (e) {
      console.log(e)
      return false
    }
    return true
  }
  const handleMultiplePayer = async () => {
    var isSuccess = await snapshotForMultiSelection('payer')
    if (isSuccess) {
      router.push('/check_sum')
    }
  }
  const handleMultipleParticipant = async () => {
    var isSuccess = await snapshotForMultiSelection('participants')
    if (isSuccess) {
      router.push('/check_sum')
    }
  }
  const handleSummerize = async () => {
    router.push('/group_balance')
  }
  const handleInsertBill = async () => {
    const newRecord = {
      /*  groupId: group.groupId,
      totalMoney: amount,
      title: item,
      description: 'description',
      prepaidPeople: payer.map((person) => ({
        memberId: person.memberId,
        amount: person.amount,
      })),
      splitPeople: participants.map((person) => ({
        memberId: person.id,
        amount: person.amount,
      })),
    }*/
      //test
      groupId: group.groupId,
      totalMoney: amount,
      title: item,
      description: 'description',
      prepaidPeople: [
        {
          memberId: '1cd03777-95fe-40c5-b844-89592a8d7ecb',
          amount: 350,
        },
      ],
      splitPeople: [
        {
          memberId: 'd09db4d6-10b6-45d8-8184-c8c066325300',
          amount: 350,
        },
      ],
    }

    try {
      await GroupService.insertBills(accessToken, newRecord)
      console.log('member', members)
      console.log('newRecord', newRecord)
      setChanged(true)
      setAmount('')
      setItem('')
    } catch (error) {
      console.error('Error adding record:', error)
    }
  }
  const handleDeleteRecord = async (billID: string) => {
    //
    /* Alert.alert(
      '確認刪除',
      '確定要刪除這筆記錄嗎？',
      [
        {
          text: '取消',
          onPress: () => setIsDialogVisible(false),
          style: 'cancel',
        },
        {
          text: '確定',
          onPress: () => {
            const newRecords = [...records]
            newRecords.splice(recordToDelete, 1)
            setRecords(newRecords)
            setIsDialogVisible(false)
          },
        },
      ],
      { cancelable: false }
    )*/
    try {
      // Assuming GroupService.insertBills is an async function that inserts bills
      await GroupService.deleteBills(accessToken, billID)
      console.log('billID', billID)
      setChanged(true)
    } catch (error) {
      console.error('Error deleting record:', error)
    }
  }
  //function
  const formatDate = (date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }
  const findMemberIdByUserId = (UserId: string, _members): string | null => {
    const _member = _members.find((m) => m.userId === UserId)
    return _member ? _member.memberId : null
  }
  const generateGroupInviteCode = async () => {
    const res = await AuthService.setGroupInviteCode(accessToken, group.groupId)
    //console.log('res_invite', res)
    //console.log('inviteCode: ', res.inviteCode)
    setInviteCode(res.inviteCode)
  }
  async function aggregation(data, userId: string, _members) {
    //data is the array of all bills for the current group
    var _myMemberId = findMemberIdByUserId(userId, _members)
    console.log('_members', _members)
    console.log('userId', userId)
    console.log('_myMemberId', _myMemberId)
    var total_amount: number = 0
    var my_balance: number = 0
    for (let i = 0; i < data.length; i++) {
      const bill: Bill = data[i]
      total_amount += bill.totalMoney
      for (let j = 0; j < bill.prepaidPeople.length; j++) {
        const person: PrepaidPerson = bill.prepaidPeople[j]
        if (person.memberId == _myMemberId) {
          my_balance += person.amount
        }
      }
      for (let j = 0; j < bill.splitPeople.length; j++) {
        const person: SplitPerson = bill.splitPeople[j]
        if (person.memberId == _myMemberId) {
          my_balance -= person.amount
        }
      }
    }
    //desired attribute total_amount and my_balance are calculated
    console.log('total_amount', total_amount)
    console.log('my_balance', my_balance)
    return { total_amount, my_balance }
  }
  //test
  const test = async () => {
    console.log('accessToken', accessToken)
    console.log('group', group)
    console.log('GroupBills', groupBills)
    console.log('GroupMember', members)
    console.log(
      'currentGroupBills',
      await AsyncStorage.getItem('@currentGroupBills')
    )
    console.log(
      'currentGroupMembers',
      await AsyncStorage.getItem('@currentGroupMembers')
    )
  }
  //UseEffect
  React.useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const _accessToken = await AsyncStorage.getItem('@accessToken')
        const JSON_group = await AsyncStorage.getItem('@currentGroup')
        const userId = await AsyncStorage.getItem('@userId')
        console.log('@userid', userId)
        setAccessToken(_accessToken)
        const _group = JSON.parse(JSON_group)
        setGroup(_group)
        const bill_res = await GroupService.getBills(
          _accessToken,
          _group.groupId
        )
        const member_res = await GroupService.getGroupMember(
          _accessToken,
          _group.groupId
        )
        const history_res = await GroupService.getBillsHistory(
          _accessToken,
          _group.groupId
        )
        console.log('_group._accessToken', _accessToken)
        setGroupBills(bill_res.groupBills)
        setMember(member_res.members) // member_res.members 是包含 id 和 name 属性的数组
        setBillsHistory(history_res.histories)
        await AsyncStorage.setItem(
          '@currentGroupBills',
          JSON.stringify(bill_res.groupBills)
        )
        await AsyncStorage.setItem(
          '@currentGroupMembers',
          JSON.stringify(member_res.members)
        )
        console.log('history_res', history_res)
        const { total_amount, my_balance } = await aggregation(
          bill_res.groupBills,
          userId,
          member_res.members
        )
        setTotalAmount(total_amount)
        setMyBalance(my_balance)
        var _fromPage = await AsyncStorage.getItem('@fromPage')
        if (_fromPage == 'payer' || _fromPage == 'participants') {
          var snapshotItem = await AsyncStorage.getItem('@snapshotItem')
          var snapshotAmount = await AsyncStorage.getItem('@snapshotAmount')
          var snapshotPayer = await AsyncStorage.getItem('@snapshotPayer')
          var snapshotParticipants = await AsyncStorage.getItem(
            '@snapshotParticipants'
          )
          setItem(snapshotItem)
          setAmount(snapshotAmount)
          //setPayer(JSON.parse(snapshotPayer))
          // setParticipants(JSON.parse(snapshotParticipants))
          console.log('fromPage', _fromPage)
          console.log('setItem', snapshotItem)
          console.log('setAmount', snapshotAmount)
          console.log('setPayer', snapshotPayer)
          console.log('setParticipants', snapshotParticipants)
          await AsyncStorage.setItem('@recoveryNeeded', '')
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (isFocused || groupInfoChanged) {
      getGroupInfo()
      setChanged(false)
    }
  }, [isFocused, groupInfoChanged])

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
          {/* header */}
          <ShadowView
            style={{
              height: '120px',
              flexDirection: 'row',
              backgroundColor: '#E0DDD6',
              justifyContent: 'center',
              alignItems: 'center',
              width: '80%',
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 30, color: 'black' }} paddingTop="15px">
                {totalAmount}
              </Text>
              <Text style={{ fontSize: 20, color: 'black' }}>total</Text>
            </View>
            <Feather
              name="users"
              size={25}
              style={{
                alignSelf: 'flex-end',
                marginBottom: 10,
                marginRight: 10,
              }}
            />
            <View
              style={{
                width: 1.5,
                backgroundColor: 'black',
                height: '100%',
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              paddingLeft="10px"
            >
              <Text style={{ fontSize: 30, color: 'black' }} paddingTop="15px">
                {myBalance}
              </Text>
              <Text style={{ fontSize: 20, color: 'black' }}>Balance</Text>
            </View>
            <Feather
              name="user"
              size={25}
              style={{
                alignSelf: 'flex-end',
                marginBottom: 10,
                marginRight: 10,
              }}
            />
          </ShadowView>

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
                    onToggleList={() => console.log('aaaa')}
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
            <View style={{ marginTop: 20 }}>
              <Button
                width={100}
                onPress={() => handleInsertBill()}
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
            </View>
          </ShadowView>

          {/* bill */}
          <ShadowView
            style={{
              backgroundColor: '#E0DDD6',
              borderRadius: 10,
              padding: 20,
              width: '80%',
            }}
          >
            {/* Left Section */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <XStack style={{ alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 20, color: 'black' }}>帳單</Text>
              </XStack>

              {/* Center Section */}
              <XStack style={{ alignItems: 'center' }}>
                <Button
                  // themeInverse
                  onPress={handleSummerize}
                  width={100}
                  style={{
                    color: 'F2EEE5',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    borderRadius: 30,
                  }}
                >
                  結餘
                </Button>
              </XStack>

              {/* Right Section */}
              <XStack>
                <XStack onPress={onpressList}>
                  <Feather name="list" size={25} />
                </XStack>
                <XStack onPress={onpressSort}>
                  <Feather name="chevrons-down" size={25} />
                </XStack>
              </XStack>
            </View>

            <View
              style={{
                height: 1.5,
                backgroundColor: 'black',
                width: '100%',
                alignSelf: 'center',
                marginTop: 20,
              }}
            />
            <View>
              {groupBills.map((bill, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                    backgroundColor: '#FAFAF4',
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 15, color: 'black' }}>
                    {bill.title}
                  </Text>
                  <View>
                    <Text style={{ fontSize: 5 }}>代墊</Text>
                    <Text style={{ fontSize: 15, color: 'black' }}>
                      {bill.totalMoney}
                    </Text>
                  </View>
                  <Button
                    size={30}
                    onPress={() => handleDeleteRecord(bill.billId)}
                    style={{ marginLeft: 10, fontSize: 10 }}
                  >
                    刪除
                  </Button>
                </View>
              ))}
            </View>
          </ShadowView>
        </View>
        <View style={{ flex: 1 }}>
          {isListVisible ? (
            <Dialog modal open={isListVisible} onOpenChange={setIsListVisible}>
              <Dialog.Portal>
                <Dialog.Overlay
                  key="overlay"
                  animation="quick"
                  opacity={0.5}
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                  bg={Colors.primary}
                  height="40%"
                  width="80%"
                  bordered
                  elevate
                  key="content"
                  animation={[
                    'quick',
                    {
                      opacity: {
                        overshootClamping: true,
                      },
                    },
                  ]}
                  enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                  exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                  x={0}
                  scale={1}
                  opacity={1}
                  y={0}
                >
                  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Text style={{ alignSelf: 'center', fontSize: 15 }}>
                      帳單紀錄
                    </Text>
                    <YStack>
                      {billsHistory.map((item, index) => (
                        <YStack
                          key={index}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                            padding: 10,
                            borderRadius: 5,
                            width: '100%',
                            // backgroundColor: 'white',
                          }}
                        >
                          <Text
                            style={{ flex: 1, fontSize: 10, color: 'black' }}
                          >
                            {item.operatorName}在
                          </Text>
                          <Text
                            style={{ flex: 1, fontSize: 10, color: 'black' }}
                          >
                            {new Date(item.timestamp).toLocaleString()}
                          </Text>
                          <Text
                            style={{ flex: 1, fontSize: 10, color: 'black' }}
                          >
                            {item.type}
                          </Text>
                          <Text
                            style={{ flex: 1, fontSize: 10, color: 'black' }}
                          >
                            {item.title}
                          </Text>
                        </YStack>
                      ))}
                    </YStack>
                  </ScrollView>
                  <Dialog.Close asChild>
                    <Button
                      onPress={() => setIsListVisible(false)}
                      style={{
                        alignSelf: 'center',
                        padding: 10,
                        marginTop: 10,
                      }}
                    >
                      確定
                    </Button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog>
          ) : null}
        </View>
        {/*Button*/}
        <View flexDirection="row" width="100%" justifyContent="center">
          <Button>
            <Link href="/group">return</Link>
          </Button>
        </View>

        <Button onPress={test}>test</Button>
        <Link href="/check_sum">goto checksum, for test</Link>
        <Dialog modal>
          <Dialog.Trigger asChild>
            <Button onPress={generateGroupInviteCode}>Show room number</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay"
              animation="quick"
              opacity={0.5}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Dialog.Content
              bg={Colors.primary}
              height="23%"
              width="80%"
              bordered
              elevate
              key="content"
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              x={0}
              scale={1}
              opacity={1}
              y={0}
            >
              <YStack alignItems="center" justifyContent="center">
                <Dialog.Title color={Colors.text} fontSize={20}>
                  "AAA"
                </Dialog.Title>
                <View height="7%" />
                <XStack height="30%" alignItems="center">
                  <Dialog.Title color={Colors.text} fontSize={20}>
                    房號
                  </Dialog.Title>
                  <View width="5%" />
                  <View
                    bg={Colors.input_bg}
                    width="35%"
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    px="1%"
                  >
                    <Dialog.Description color={Colors.text}>
                      {inviteCode}
                    </Dialog.Description>
                  </View>
                  <Button bg={Colors.primary} onPress={copyToClipboard}>
                    <FontAwesome5 name="copy" size={24} color="black" />
                  </Button>
                </XStack>
                <View height="10%" />
                <Dialog.Close displayWhenAdapted asChild>
                  <Button
                    theme="active"
                    aria-label="Close"
                    bg={Colors.button_primary}
                    borderRadius={20}
                    width="40%"
                  >
                    close
                  </Button>
                </Dialog.Close>
              </YStack>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </ScrollView>
    </View>
  )
}
