import React, { useState } from 'react'
import { Text, View, Button, Input, XStack, Label } from 'tamagui'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage' 

export default function inputGroupScreen() {
  const router = useRouter()
  const [opacity, setOpacity] = useState(0)

  const handleConfirmButton = async() => {
    router.navigate('/group')  
  }
  const handleCancelButton = async() => {
    
    router.navigate('/group')
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
        <Text color={Colors.text} mt="1%" fontSize={20} opacity={opacity}>
          groupName
        </Text>
        <View height="10%" />
        <XStack alignItems="center">
          <Label width="20%">
            <Text fontSize={20}>房號</Text>
          </Label>
          <Input 
            placeholder='請輸入房號' 
            width="45%" 
            alignItems="center"/>
        </XStack>
        
        <View height="7%" />
        <View flexDirection="row" mt="5%">  
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
    </View>
  )
}
