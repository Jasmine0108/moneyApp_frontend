import React from 'react'
import { Text, View, Button, Input, ToggleGroup } from 'tamagui'
import { Colors } from '../constants/Colors'
import AuthService from '../services/auth/auth'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage' 

export default function inputGroupScreen() {
  const router = useRouter()
  const [addColor, setAddColor] = React.useState(Colors.button_primary)
  const [createColor, setCreateColor] = React.useState(Colors.button_primary)
  const [addBorderColor, setAddBorderColor] = React.useState(Colors.input_bg)
  const [createBorderColor, setCreateBorderColor] = React.useState(Colors.input_bg)
  
  const handleAddGroupButton = () => {
    setAddColor(Colors.input_bg)
    setCreateColor(Colors.button_primary)
    setAddBorderColor(Colors.text)
    setCreateBorderColor(Colors.input_bg)
    
  }
  const handleCreateGroupButton = () => {
    setCreateColor(Colors.input_bg)
    setAddColor(Colors.button_primary)
    setCreateBorderColor(Colors.text)
    setAddBorderColor(Colors.input_bg)

  }
  const handleConfirmButton = () => {
    if(addColor==Colors.input_bg)
        router.push('/group')
    if(createColor==Colors.input_bg)
        router.push('/input_group')
  }

  return (
    <View flex={1} bg={Colors.bg} alignItems="center" justifyContent="center" > 
     <View 
        bg={Colors.primary} 
        height="25%" 
        width="85%" 
        alignItems="center" 
        justifyContent="center" 
        borderRadius={15}
      >
        <Button 
            bg={addColor} 
            width="75%" 
            borderRadius={20}
            borderWidth={2}
            borderColor={addBorderColor}
            onPress={handleAddGroupButton}>
            <Text color={Colors.text} margin="1%">
                加入群組
            </Text>
        </Button>
        <View height="5%"></View>
        <Button 
            bg={createColor} 
            width="75%" 
            borderRadius={20}
            borderWidth={2}
            borderColor={createBorderColor}
            onPress={handleCreateGroupButton}>
            <Text color={Colors.text} margin="1%">
              創建群組
            </Text>
        </Button>
        <View height="5%"></View>
        <Button 
            bg={Colors.button_primary} 
            width="30%" 
            borderRadius={20}
            onPress={handleConfirmButton}>
            <Text color={Colors.text} margin="1%">
              確定
            </Text>
        </Button>
      </View>
        
    </View>
  )
}

