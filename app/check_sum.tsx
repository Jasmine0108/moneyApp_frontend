import React from 'react'
import { Text, View, Button, Select,Adapt, Sheet, Input, XStack  } from 'tamagui'
import type { SelectProps } from 'tamagui'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import { useIsFocused } from '@react-navigation/native'
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons';
import GroupService from '../services/group/group'
import AsyncStorage from '@react-native-async-storage/async-storage' 
interface members {
  name: string
  userId: string
}

interface data {
  name: string
  id: string
  userId: string
  amount: number
}


const exampleData: data[] = [
  { name: 'User1', id:'id1', userId:'userId1', amount: 800 },
  { name: 'User2', id:'id2', userId:'userId2', amount: 500 },
  { name: 'User3', id:'id3', userId:'userId3', amount: 200 },
  { name: 'User4', id:'id4', userId:'userId4', amount: 800 },
  { name: 'User5', id:'id5', userId:'userId5', amount: 500 },
]
const exampleMembers: members[] = [
  { name: 'User1', userId:'userId1' },
  { name: 'User2', userId:'userId2' },
  { name: 'User3', userId:'userId3' },
  { name: 'User4', userId:'userId4' },
  { name: 'User5', userId:'userId5' },

]



export default function checkSumScreen() {
  const router = useRouter()
  const [count, setCount] =  React.useState(0)
  const [selections, setSelections] = React.useState([])
  const [inputs, setInputs] = React.useState([])
  const [oldSelect, setOldSelect] = React.useState('')

  const getGroupInfo = async() =>{
    try{
      var accessToken = await AsyncStorage.getItem('@accessToken')
      var groupId = await AsyncStorage.getItem('@groupId')
    }
    catch(e){
        console.log(e)
    }
    const res = await GroupService.getGroupMember(groupId, accessToken)
    console.log('member_res', res)
  }
 
  const handleCancelButton = () => {
    router.navigate('/group_content') 
  }
  const handleConfirmButton = () => {
    router.push('/group_content')

  }
  const handleAddButton = () => {
    setCount(count+1)
    const newSelection = `selection${count}`
    setSelections([...selections, newSelection]) 
    const newInput = `input${count}`
    setInputs([...inputs, newInput])  
  }
  const minusButtton =() => {

  }
  const setAmmount = (rowIndex: number) => {

  }
  const testFunction = (value: string) => {
    console.log("test")
    setOldSelect(value)
  }

  

  return (
    <View flex={1} bg={Colors.bg} alignItems="center" justifyContent="center" >
      <View 
        bg="#545454" 
        width="30%" 
        height="5%" 
        margin="3%"
        borderRadius={20} 
        alignItems="center" 
        justifyContent="center">
        <Text color="white" fontSize="$5">total</Text>
      </View>
      
      {selections.map((selection, index)=>(
        <View key={index} padding={2} bg={index%2==0? '#E0DDD6':Colors.bg} height="6%" width="80%" alignItems="center" justifyContent="center">
          <XStack alignItems="center">
            <Button bg={index%2==0? '#E0DDD6':Colors.bg} icon={<Entypo name="minus" size={16} color="#545454"/>}/>
            <SelectItem key={selection} id={(index).toString()} onValueChange={testFunction} value={oldSelect}/>
            <View width="15%"></View>
            <Input 
              key={inputs[index]} 
              bg={index%2==1? '#DDDDDD':'#FFFFFF'} 
              width="25%" 
              onChangeText={(t) => setAmmount(index)}/>
          </XStack>
        </View>
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
        <Text fontSize={20}>800</Text>
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
            確定
          </Text>
        </Button>
      </View>
    </View>
  )
}

export function SelectItem(props: SelectProps) {
  const [val, setVal] = React.useState('')
  const [maxHeight, setMaxHeight] = React.useState(0)
  const [member, setMember] = React.useState<members[]>(exampleMembers)
  const [data, setData] = React.useState<data[]>([])

  const isFocused = useIsFocused();
  const calculate_height = ()=> {
    if(exampleMembers.length*50 > 300)
      setMaxHeight(300)
    else setMaxHeight(exampleMembers.length*50)
  }
  const setUserSelection = (value:string) => {
    var prev_val = val
    props.value=prev_val
    props.onValueChange(prev_val)
    setVal(value)
    props.id

  }
  
 
  React.useEffect(() => {
    calculate_height()
  },[isFocused]) 
 

  return(
    <Select value={val} onValueChange={setUserSelection}>
      <Select.Trigger width="40%" iconAfter={<AntDesign name="caretdown" size={15} color='#BCBCBC' />}
      {...(parseInt(props.id)%2==0?{bg:"#FFFFFF"}:{bg:'#DDDDDD'})}>
        <Select.Value/>
      </Select.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet 
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'timing',
            duration: 0, 
          }}>
          <Sheet.Frame position="relative" margin="20%" width="40%" maxHeight={maxHeight} >
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
            <Select.Label>Members</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {React.useMemo(
              () =>
                exampleMembers.map((member, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={member.userId}
                      value={member.name}
                      
                    >
                      <Select.ItemText>{member.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <AntDesign name="check" size={16} color="black" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),[exampleMembers])}
                
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>

  )
}

