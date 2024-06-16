import React from 'react'
import { Text, View, Button, Input } from 'tamagui'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'

export default function mainScreen() {
  const router = useRouter()
  const handleConfirmButton = () => {
    router.push('/group')
  }
  const handleCancelButton = () => {
    router.push('/group')
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
        <Input
            key='add_group'
            placeholder='請輸入群組名稱'
            bg={Colors.input_bg}
            width="80%"
            mt="10%"
        />
        <View flexDirection="row" mt="15%">  
          <Button 
            bg={Colors.button_primary} 
            width="35%" 
            borderRadius={20}
            onPress={handleConfirmButton}
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
            onPress={handleCancelButton}
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
