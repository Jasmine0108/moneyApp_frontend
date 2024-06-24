import React, { useState } from 'react'
import { Text, View, Button, Select,Adapt, Sheet, Input, XStack, Avatar, SelectIcon, SelectGroupFrame  } from 'tamagui'
import type { SelectProps } from 'tamagui'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage' 
import { Alert } from 'react-native'
interface members {
  name: string
  userId: string
  avatar: string
}

interface data {
  name: string
  rowId: string
  userId: string
  amount: string
  avatar: string
}
interface prop {
  member: members[]
  onSelectFinished: (selectRowId: string, selectUserId: string) => void
  onChangedTextFinished: (selectRowId: string, money: string) => void
}

interface prop extends SelectProps{}

const exampleData: data[] = [
  { name: 'User1', rowId:'id1', userId:'userId1', amount: '800', avatar:"https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80" },
  { name: 'User2', rowId:'id2', userId:'userId2', amount: '500', avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" },
  { name: 'User3', rowId:'id3', userId:'userId3', amount: '200', avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" },
  { name: 'User4', rowId:'id4', userId:'userId4', amount: '800', avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" },
  { name: 'User5', rowId:'id5', userId:'userId5', amount: '500', avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" },
]
const exampleMembers : members[] = [
  { name: 'User123456', userId:'userId1', avatar:"https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80" },
  { name: 'User2', userId:'userId2', avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" },
  { name: 'User3', userId:'userId3', avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" },
  { name: 'User4', userId:'userId4', avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"},
  { name: 'User5', userId:'userId5', avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" },
]

export default function checkSumScreen() {
  const router = useRouter()
  const [count, setCount] =  useState(0)
  const [showMember, setShowMember] = useState<members[]>(exampleMembers)
  const [showData, setShowData] = useState<data[]>([])
  const [total, setTotal] = useState(0) //test
  const [addSum, setAddSum] = useState(0)
  const [sumOpacity, setSumOpacity] = useState(0)
  const [confirmButtonText, setConfirmButtonText] =  useState("確定")

  const handleCancelButton = () => {
    router.navigate('/group_content') 
  }
  const handleConfirmButton = () => {
    if(confirmButtonText == "儲存"){
      router.push('/group_content')
    }
      
    let count_empty = 0
    let isProblem = false
    if(showData.length == 0){
      Alert.alert('Please fill in data')
      isProblem = true
    }
    let dealtData = []
    for(let i = 0; i < showData.length; ++i){
      let data = showData[i]
      if(data.amount=="" && data.userId != 'init'){
        Alert.alert('Amount cannot be empty')
        isProblem = true
        break
      }
      else if(data.amount=='' && data.userId == 'init')
        count_empty += 1
      else if(data.userId == 'init' && parseInt(data.amount) >= 0){
        Alert.alert('Member cannot be empty')
        isProblem = true
        break
      }
      else if(parseInt(data.amount) < 0){
        Alert.alert('Amount cannot be less than 0')
        isProblem = true
        break
      }
      else 
        dealtData.push(data)
    }
    if(count_empty == showData.length){
      Alert.alert('Please fill in data')
      isProblem = true
    }
    console.log(isProblem)
    if(isProblem == false){
      //console.log('print', dealtData.map(data => parseInt(data.amount)))
      let sum = 0
      for(let i = 0; i < dealtData.length; ++i) {
        sum += parseInt(dealtData[i].amount)
      }
      console.log('sum', sum)
      console.log('confirm:',showData)
      setAddSum(sum)
      setSumOpacity(1)
      if(sum == total)
        setConfirmButtonText("儲存")
    }
    
    //router.push('/group_content')*/
  }
  const handleAddButton = () => {
    if(count < exampleMembers.length){
      setSumOpacity(0)
      setConfirmButtonText("確定")
      let tmpData = showData
      let tmpRow = { name: '', rowId: count.toString(), userId:"init", amount: "", avatar:'https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80' }
      tmpData.push(tmpRow)
      setShowData(tmpData)
      setCount(count+1)
      console.log('addButtonData', showData)
    }  
    else
      Alert.alert('Boxes exceed group member number.')     
  }
  
  const handleOnSelectFinished = (selectRowId: string,  selectUserId: string) => {
    setSumOpacity(0)
    setConfirmButtonText("確定")
    const updatedData = showData.map(data => {
      if (data.rowId === selectRowId) {
        return { name:data.name, rowId: selectRowId, userId:selectUserId, amount: data.amount, avatar: data.avatar}
      }
      return data;
    })
    console.log('updataData', updatedData)
    setShowData(updatedData)  
  }

  const handleShowMember = (value: string) => {
    setSumOpacity(0)
    setConfirmButtonText("確定")
    var pre_now_select = value.split(',')
    //console.log('pre_new_select', pre_now_select)
    //setOldSelectId(pre_now_select[0])
    let filteredMembers = []
    if(pre_now_select[1] != "init"){
      filteredMembers = showMember.filter(function(member) {
        if(member.userId != pre_now_select[1])
          return member.userId
      })
    }
    if(pre_now_select[0] != "init"){
      let user = exampleMembers.find(member => member.userId === pre_now_select[0])
      filteredMembers.push(user)
    }
    setShowMember(filteredMembers)
    
  }
  const getAmount =(inputRowId: string, money: string)=> { 
    setSumOpacity(0)
    setConfirmButtonText("確定")
    const updatedData = showData.map(data => {
      if (data.rowId === inputRowId) {  
        return { name:data.name, rowId: data.rowId, userId:data.userId, amount: money, avatar: data.avatar};
      }
      return data
    })
    setShowData(updatedData)
    console.log('money_update', updatedData)
    
  }
  const handleTotal =(text: string) =>{
    setSumOpacity(0)
    setConfirmButtonText("確定")
    setTotal(parseInt(text))
  }

  return (
    <View flex={1} bg={Colors.bg} alignItems="center" justifyContent="center" >
      <Input 
        bg="#545454" 
        color='#FFFFFF'
        width="30%" 
        height="5%" 
        margin="3%"
        fontWeight='$10'
        fontSize='$6'
        borderRadius={20} 
        textAlign='center'
        defaultValue='0'
        onChangeText={(t) => handleTotal(t)}/>
      {showData.map((data, index)=>(
        <UserAddRow 
          key={data.rowId}
          id={index.toString()}
          onValueChange={handleShowMember}
          member={showMember}
          onSelectFinished={handleOnSelectFinished}
          onChangedTextFinished={getAmount}/>      
      ))}
      <Button 
        bg={Colors.button_secondary} 
        width="35%" 
        borderRadius={20}
        onPress={handleAddButton}
        margin="5%"
        icon={<AntDesign name="plus" size={24} color="white" /> }
      />   
      <View height={2} bg="#545454" width="80%"></View>
      <XStack my="5%" alignItems="center" justifyContent="center">
        <Ionicons name="people-sharp" size={40} color="#545454"/>
        <View width="50%"></View>
        <Text 
          fontSize={20} 
          opacity={sumOpacity}
          color={addSum == total?'#10520E':'#AA2929'}>
          {addSum}
        </Text>
      </XStack>
      <View flexDirection="row">  
        <Button 
          bg={Colors.button_primary} 
          width="35%" 
          borderRadius={20}
          onPress={handleCancelButton}
        >
          <Text color={Colors.text} margin="1%">
            取消
          </Text>
        </Button>
        <View width="10%" />
        <Button 
          bg={Colors.button_primary} 
          width="35%" 
          borderRadius={20}
          onPress={handleConfirmButton}
        >
          <Text color={Colors.text} margin="1%" >
            {confirmButtonText}
          </Text>
        </Button>
      </View>
    </View>
  )
}

export function UserAddRow(prop : prop) {
   
  const [selectMemberId, setselectMemberId] = useState('init')
  const [selectMemberAvatar, setselectAvatar] = useState('')
  const [maxHeight, setMaxHeight] = useState(0)
  const [avatarOpacity, setAvatarOpacity] = useState(0)

  React.useEffect(() => {
    calculate_height()
  },[prop.member]) 

  const calculate_height = ()=> {
    if(prop.member.length*45 > 300)
      setMaxHeight(300)
    else setMaxHeight(prop.member.length*45)
  }
  const setUserSelection = (value: string) => {
    var prev_id = selectMemberId
    //console.log('prev_id', selectMemberId)
    setselectMemberId(value)
    //console.log('now_id', selectMemberId)
    prop.onValueChange(prev_id +','+ value)
    prop.onSelectFinished(prop.id, value)
    setAvatarOpacity(1)
  }
 
  return(
    <View 
      {...(parseInt(prop.id)%2==0?{bg:"#E0DDD6"}:{bg:Colors.bg})}
      height="6%" 
      width="80%" 
      py="3%"
      alignItems="center" 
      justifyContent="center">
        <XStack>
          <Button 
            id = {prop.id}
            {...(parseInt(prop.id)%2==0?{bg:"#E0DDD6"}:{bg:Colors.bg})}
            icon={<Entypo name="minus" size={25} color="#545454"/>}
            px={0}/> 
            <View width="1%"></View>
            <Select value={selectMemberId} onValueChange={setUserSelection} >
              <Select.Trigger width="45%" px="1%" iconAfter={<AntDesign name="caretdown" size={15} color='#BCBCBC'/>}
              {...(parseInt(prop.id)%2==0?{bg:"#FFFFFF"}:{bg:'#DDDDDD'})}>
  
                <XStack justifyContent='flex-start'>
                <Avatar circular size="$1" marginLeft={0}>
                  <Avatar.Image
                    src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
                    opacity={avatarOpacity}
                />
                
                  <Avatar.Fallback backgroundColor="$white" />
                </Avatar>
                <View width="2%"></View>
                <Select.Value/>
                </XStack>
                
              </Select.Trigger>
              <Adapt when="sm" platform="touch">
                <Sheet 
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: 'timing',
                    duration: 0, 
                  }}>
                  <Sheet.Frame position="relative" margin="25%" width="36%" maxHeight={maxHeight} >
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay
                    animation="medium"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}        
                  />
                </Sheet> 
              </Adapt>
              <Select.Content zIndex={200000}>
                <Select.Viewport>
                  <Select.Group>
                    {/* for longer lists memoizing these is useful */}
                    {React.useMemo(
                      () =>
                        prop.member.map((user, i) => {
                          return (
                            <Select.Item
                              index={i}
                              key={user.userId}
                              value={user.userId}  
                            >
                            <XStack justifyContent='flex-start'>
                              <Avatar circular size="$1">
                                <Avatar.Image
                                  src={user.avatar}
                              />
                                <Avatar.Fallback backgroundColor="$white" />
                              </Avatar>
                              <View width="2%"></View>
                              <Select.ItemText>{user.name}</Select.ItemText>
                              <View width="10%"></View>
                              <Select.ItemIndicator marginLeft="auto" >
                                <AntDesign name="check" size={16} color="black"  />
                              </Select.ItemIndicator>
                              </XStack>
                            </Select.Item>
                          )
                        }),[prop.member])}
                        
                  </Select.Group>
                </Select.Viewport>
              </Select.Content>
            </Select>
            <View width="10%"></View>
            <Input 

              {...(parseInt(prop.id)%2==0?{bg:"#FFFFFF"}:{bg:'#DDDDDD'})} 
              width="25%" 
              textAlign='center'
              defaultValue=""
              onChangeText={(t) => prop.onChangedTextFinished(prop.id,t)}
              
              />
          </XStack>
        </View>
  )
}


