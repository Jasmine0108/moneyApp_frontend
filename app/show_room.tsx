import React from 'react'
import { Text, View, Button } from 'tamagui'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage' 
import { FontAwesome5 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';


export default function inputGroupScreen() {
  const router = useRouter()
  const [copiedText, setCopiedText] = React.useState('');
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
  }*/
  const handleCloseButton = async() => {
    router.navigate('/group')
  }
  const copyToClipboard = async() => {
    try{
      await Clipboard.setStringAsync('000000');
      var roomNumber = await Clipboard.getStringAsync();
    }
    catch (e) {
      console.log(e)
    }
    setCopiedText(roomNumber);
  };
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
        <View flexDirection="row" height="20%" mt="3%" alignItems="center" >
          <Text color={Colors.text} fontSize={20}>
            房號
          </Text>
          <View width="5%" />
          <View bg={Colors.input_bg} width="30%" height="100%" alignItems="center" justifyContent="center" px="1%">
            <Text color={Colors.text}>
              000000
            </Text>
          </View>
          <View width="1%" />
          <Button bg={Colors.primary} onPress={copyToClipboard}>
            <FontAwesome5 name="copy" size={24} color="black"/>
          </Button>
        
        </View>
        <View height="10%" />
        <Button 
          bg={Colors.button_primary} 
          width="35%" 
          borderRadius={20}
          onPress={handleCloseButton}
        >
          <Text color={Colors.text} margin="1%">
            關閉
          </Text>
        </Button>
        
      </View>
    </View>
  )
}
