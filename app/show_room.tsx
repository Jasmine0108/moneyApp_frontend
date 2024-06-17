import React from 'react'
import { Text, View, Button } from 'tamagui'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
//import AsyncStorage from '@react-native-async-storage/async-storage' 
import { FontAwesome5 } from '@expo/vector-icons';

export default function inputGroupScreen() {
  const router = useRouter()
  /*
  const getGroupName = async() =>{
    try{
      var groupName = await AsyncStorage.getItem('@currentGroupName')
    } 
    catch(e){
      console.log(e)
      return 'error'
    }
    return groupName 
  } */ 
  const handleConfirmButton = async() => {
    router.push('/group')  
  }
  const handleCancelButton = async() => {
    
    router.push('/group')
  }
  //var groupName = getGroupName()

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
        <Text color={Colors.text} mt="1%" fontSize={20}>
          groupName
        </Text>
        <View height="7%" />
        <View flexDirection="row" mt="3%">
          <Text color={Colors.text} fontSize={20}>
            房號
          </Text>
          <View width="5%" />
          <View bg={Colors.input_bg} width="30%" alignItems="center" justifyContent="center" px="1%">
            <Text color={Colors.text}>
              000000
            </Text>
          </View>
          <View width="5%" />
          <FontAwesome5 name="copy" size={24} color="black" />
        </View>
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
