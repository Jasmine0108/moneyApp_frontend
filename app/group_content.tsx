import React, { useState } from 'react'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'
import AuthService from '../services/auth/auth'
import GroupService from '../services/group/group'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import * as Clipboard from 'expo-clipboard'
import {
  ScrollView,
  View,
  Text,
  Input,
  Button,
  styled,
  XStack,
  YStack,
  Dialog,
  Group,
} from 'tamagui'
import MultiSelect from 'react-native-multiple-select'
import { Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { router, Link } from 'expo-router'
import { Alert } from 'react-native'
// new add

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
interface Group {
  groupId: string
  name: string
  description: string
  avatarUrl: string
}

interface User{
  id: string
  name: string
}


const ShadowView = styled(View, {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  //elevation: 5,
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  margin: 20,
})


////////////////////////////////////////////////////////////////////
export default function groupContentScreen() {
  const [groupName, setGroupName] = React.useState('')
  const [accessToken, setAccessToken] = React.useState('')
  const [groupId, setGroupId] = React.useState('')
  const [inviteCode, setInviteCode] = React.useState('')

  const [payer, setPayer] = useState([])
  const [participants, setParticipants] = useState([])
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [leftNumber, setLeftNumber] = useState(0)
  const [rightNumber, setRightNumber] = useState(0)
  const [records, setRecords] = useState([])
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [user, setUser] = React.useState<User | null>(null);

  const getSubmit = (value1) => {
    console.log('new submit value***', value1)
    router.push('')
  }
  const onPayerChange = (selectedPayer) => {
    setPayer(selectedPayer)
  }

  const onParticipantsChange = (selectedParticipants) => {
    setParticipants(selectedParticipants)
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate
    setShow(false)
    setDate(currentDate)
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }
  const formatDate = (date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }
  const onpressList = () => {
    alert('press list!')
  }
  const onpressSort = () => {
    alert('press sort')
  }

  const router = useRouter()
  const isFocused = useIsFocused()
  // new add
  const [groupBills, setGroupBills] = React.useState<bills[]>([])
  const [group, setGroup] = React.useState<Group>()
  const [groupInfoChanged, setChanged] = React.useState(0) //******** */
  const [member, setMember] = useState([])

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(inviteCode)
    } catch (e) {
      console.log(e)
    }
  }
  const generateGroupInviteCode = async () => {
    const res = await AuthService.setGroupInviteCode(accessToken, groupId)
    console.log('res_invite', res)
    console.log('inviteCode: ', res.inviteCode)
    setInviteCode(res.inviteCode)
  }
  async function aggregation(data, _myMemberId: string) {
    //data is the array of all bills for the current group
    var total_amount: number = 0
    var my_balance: number = 0
    for (let i = 0; i < data.length; i++) {
      const bill: bills = data[i]
      total_amount += bill.totalMoney
      for (let j = 0; j < bill.prepaidPeople.length; j++) {
        const person: prepaidPerson = bill.prepaidPeople[j]
        if (person.memberId == _myMemberId) {
          my_balance += person.amount
        }
      }
      for (let j = 0; j < bill.splitPeople.length; j++) {
        const person: prepaidPerson = bill.splitPeople[j]
        if (person.memberId == _myMemberId) {
          my_balance += person.amount
        }
      }
    }
   //desired attribute total_amount and my_balance are calculated
    console.log('total_amount', total_amount)
    console.log('my_balance', my_balance)
    return { total_amount, my_balance }; 
  }
 // new add
  React.useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const _accessToken = await AsyncStorage.getItem('@accessToken');
        const JSON_group = await AsyncStorage.getItem('@currentGroup');
        const JSON_user = await AsyncStorage.getItem('@userid');
        const user = JSON.parse(JSON_user);
        setUser(user);
        setAccessToken(_accessToken);
        const _group = JSON.parse(JSON_group);
        setGroup(_group);
        const bill_res = await GroupService.getBills(_accessToken, _group.groupId);
        const member_res = await GroupService.getGroupMember(_accessToken, _group.groupId);
        console.log('_group._accessToken', _accessToken);
        setGroupBills(bill_res.groupBills);
        setMember(member_res.members); // member_res.members 是包含 id 和 name 属性的数组
        console.log('member:', member);
        await AsyncStorage.setItem('@currentGroupBills', JSON.stringify(bill_res.groupBills));
        await AsyncStorage.setItem('@currentGroupMembers', JSON.stringify(member_res.members));
        const { total_amount, my_balance } = await aggregation(bill_res.groupBills, user.id.toString());
        setLeftNumber(total_amount);
        setRightNumber(my_balance);
      } catch (e) {
        console.log(e);
      }
    };
    if (isFocused || groupInfoChanged) {
      getGroupInfo();
    }
  }, [isFocused, groupInfoChanged]);
  
  const test = async () => {
    console.log('accessToken', accessToken)
    console.log('group', group)
    console.log('GroupBills', groupBills)
    console.log('GroupMember', member)
    console.log(
      'currentGroupBills',
      await AsyncStorage.getItem('@currentGroupBills')
    )
    console.log(
      'currentGroupMembers',
      await AsyncStorage.getItem('@currentGroupMembers')
    )
  }
  const handleAddRecord = async (
    groupId: string,
    item: string,
    amount: number,
    description: string,
    payer: { id: string; name: string; paidAmount: number }[],
    participants: { id: string; name: string; shareAmount: number }[]
  ) => {
    const newRecord: bills = {
      billId: generateBillId(), // Function to generate a unique bill ID
      groupId: groupId,
      totalMoney: parseFloat(amount.toString()),
      title: item,
      description: description,
      prepaidPeople: payer.map(person => ({
        memberId: person.id,
        amount: parseFloat(person.paidAmount.toString()),
        username: person.name
      })),
      splitPeople: participants.map(person => ({
        memberId: person.id,
        amount: parseFloat(person.shareAmount.toString()),
        username: person.name
      }))
    };
  
    try {
      // Assuming GroupService.insertBills is an async function that inserts bills
      await GroupService.insertBills(accessToken, newRecord); 
      console.log('Record added successfully');
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };
  
  const generateBillId = () => {
    return 'bill' + Date.now();
  };
 
  
  const confirmDeleteRecord = () => {
    Alert.alert(
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
            const newRecords = [...records];
            newRecords.splice(recordToDelete, 1);
            setRecords(newRecords);
            setIsDialogVisible(false);
          },
        },
      ],
      { cancelable: false }
    );
  };



  return (
    <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>
      <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' , width:'100%'}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
          }}
        >
          {/* 頂部 */}
          <ShadowView
            style={{
              height: '30%',
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
              
              <Text style={{ fontSize: 30, color: 'black' }}>{leftNumber}</Text>
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
            >
              <Text style={{ fontSize: 30, color: 'black' }}>
                {rightNumber}
              </Text>
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

          {/* 中間區域 */}
          <ShadowView
            style={{
              height: '70%',
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
              <View style={{ flex: 1 }}>
              <MultiSelect
                hideTags
                submitButtonText="選擇多人"
                items={member}
                uniqueKey="id"
                displayKey="name"
                selectedItems={payer}
                onSelectedItemsChange={onPayerChange}
                onToggleList={() => console.log('aaaa')}
                selectText="  付款人"
                styleDropdownMenu={{ backgroundColor: 'white' }}
                onSubmitclick={(value1) => getSubmit(value1)}
                searchInputStyle={{ height: 0 }} // This hides the search input by reducing its height to zero
                customSearchInputStyle={{ height: 0 }} // Ensuring the custom search input style also hides the input
                searchIcon={() => null} // This renders nothing for the search icon
                styleMainWrapper={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  paddingHorizontal: 12,
                }} />
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
              <View style={{ flex: 1 }} borderRadius="20px">
              <MultiSelect
                hideTags
                items={member}
                uniqueKey="id"
                displayKey="name"
                selectedItems={participants}
                onSelectedItemsChange={onParticipantsChange}
                selectText="  分帳者"
                styleDropdownMenu={{ backgroundColor: 'white' }}
                onSubmitclick={(value1) => getSubmit(value1)}
                searchInputStyle={{ height: 0 }} // This hides the search input by reducing its height to zero
                customSearchInputStyle={{ height: 0 }} // Ensuring the custom search input style also hides the input
                searchIcon={() => null}

                styleMainWrapper={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  paddingHorizontal: 12,
                }} />
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
              <Button onPress={showDatepicker} style={{ flex: 1, color: 'F2EEE5', }} >
                <Text>{formatDate(date)}</Text>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    onChange={onChange}
                  />
                )}
              </Button>
            </View>
            <View style={{ marginTop: 20 }}>
              <Button
                width={100}
                onPress={() => handleAddRecord(
                  groupId,
                  item,
                  parseFloat(amount),
                  "Your description here",
                  payer,
                  participants
                )}
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

          {/* 底部區域 */}
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
                  onPress={()=>console.log('member:', member)}
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
                <Text style={{ flex: 1, fontSize: 15, color: 'black' }}>{bill.title}</Text>
                <View>
                  <Text style={{ fontSize: 5 }}>代墊</Text>
                  <Text style={{ fontSize: 15, color: 'black' }}>{bill.totalMoney}</Text>
                </View>
                <Button
                  size={30}
                  onPress={confirmDeleteRecord}
                  style={{ marginLeft: 10, fontSize: 10 }}
                >
                  刪除
                </Button>
              </View>))}
            </View>
          </ShadowView>
        </View>
      </ScrollView>

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
                {Group.name}
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
      <Link href="/group">return</Link>
      <Link href="/check_sum">check_sum</Link>
      <Link href="/group_balance">balance</Link>
      <Button onPress={test}>test</Button>
    </View>
  )
}
