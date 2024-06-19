import React from 'react'
import { Text, View, Button } from 'tamagui'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'

export default function inputGroupScreen() {
  const router = useRouter()
  
  const handleAddGroupButton = () => {
    router.push('/join_group') 
  }
  const handleCreateGroupButton = () => {
    router.push('/create_group')

  }

  return (
    <View flex={1} bg={Colors.bg} alignItems="center" justifyContent="center" > 
     <View 
        bg={Colors.primary} 
        height="25%" 
        width="65%" 
        alignItems="center" 
        justifyContent="center" 
        borderRadius={15}
      >
        <Button 
            bg={Colors.bg} 
            width="75%" 
            borderRadius={15}
            borderWidth={4}
            borderColor={Colors.input_bg}
            onPress={handleAddGroupButton}>
            <Text color={Colors.text} margin="1%">
              加入群組
            </Text>
        </Button>
        <View height="8%"></View>
        <Button 
            bg={Colors.bg} 
            width="75%" 
            borderRadius={15}
            borderWidth={4}
            borderColor={Colors.input_bg}
            onPress={handleCreateGroupButton}>
            <Text color={Colors.text} margin="1%">
              創建群組
            </Text>
        </Button>
        
      </View>
        
    </View>
  )
}

