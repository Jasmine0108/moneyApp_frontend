import React from 'react'
import { Text, View, Button, Select,Adapt, Sheet, Input, XStack  } from 'tamagui'
import type { SelectProps } from 'tamagui'
import { Dimensions } from 'react-native'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import { useIsFocused } from '@react-navigation/native'
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons';



export function SelectItem(props: SelectProps) {
  const [val, setVal] = React.useState('')
  const [maxHeight, setMaxHeight] = React.useState(0)

  const isFocused = useIsFocused();
  const calculate_height = ()=> {
    if(items.length*50 > 300)
      setMaxHeight(300)
    else setMaxHeight(items.length*50)
  
  }
  React.useEffect(() => {
    calculate_height()
  },[isFocused]) 
 

  return(
    <Select value={val} onValueChange={setVal} disablePreventBodyScroll {...props}>
      <Select.Trigger width="40%" >
        <Select.Value/>
      </Select.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet 
          native={!!props.native}
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
                items.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name}
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <AntDesign name="check" size={16} color="black" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),[items])}
                
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>

  )
}


export default function inputGroupScreen() {
  const router = useRouter()
  const [count, setCount] =  React.useState(0)
  const [selections, setSelections] = React.useState([])
  const [inputs, setInputs] = React.useState([])
 
  
  
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
    const newInput = `innput${count}`
    setInputs([...inputs, newInput]) 
    const screenHeight = Dimensions.get('window').height;
    console.log('height', screenHeight)
    
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
      <View padding='$1' bg='#E0DDD6' height="7%" width="80%" alignItems="center" justifyContent="center">
        <XStack alignItems="center">
          <Entypo name="minus" size={24} color="black" />
          <View width="2%"></View>
          <SelectItem key='selection0'/>
          <View width="15%"></View>
          <Input key='input0' bg={Colors.bg} width="25%" defaultValue='200'/>
        </XStack>
      </View>

      {selections.map((selection, index)=>(
        <View key={index} padding='$1' bg={index%2==0? Colors.bg:'#E0DDD6'} height="7%" width="80%" alignItems="center" justifyContent="center">
          <XStack alignItems="center">
            <Entypo name="minus" size={24} color="#545454" />
            <View width="2%"></View>
            <SelectItem key={selection}/>
            <View width="15%"></View>
            <Input key={inputs[index]} bg={index%2==1? Colors.bg:'#E0DDD6'} width="25%" defaultValue='200'/>
          </XStack>
        </View>
      ))}
      <Button 
        bg={Colors.button_secondary} 
        width="35%" 
        borderRadius={20}
        onPress={handleAddButton}
        margin="5%"
      >
        <AntDesign name="plus" size={24} color="white" />   
      </Button>
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

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
  { name: 'Melon' },
  { name: 'Honeydew' },
  { name: 'Starfruit' },
  { name: 'Blueberry' },
  { name: 'Raspberry' },
  { name: 'Strawberry' },
  { name: 'Mango' },
  { name: 'Pineapple' },
  { name: 'Lime' },
  { name: 'Lemon' },
  { name: 'Coconut' },
  { name: 'Guava' },
  { name: 'Papaya' },
  { name: 'Orange' },
  { name: 'Grape' },
  { name: 'Jackfruit' },
  { name: 'Durian' },
 
]