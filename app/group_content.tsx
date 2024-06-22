import React from 'react'
import { View, Button, Dialog, XStack, YStack } from 'tamagui'
import { Link } from 'expo-router'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'
import AuthService from '../services/auth/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useIsFocused } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';

export default function groupContentScreen(){
  const [groupName, setGroupName] = React.useState('')
  const [accessToken, setAccessToken] = React.useState('')
  const [groupId, setGroupId] = React.useState('')
  const [inviteCode, setInviteCode] = React.useState('')

  const router = useRouter()
  const isFocused = useIsFocused();
  const copyToClipboard = async() => {
    try{
      await Clipboard.setStringAsync(inviteCode);
    }
    catch (e) {
      console.log(e)
    }
  };
  const generateGroupInviteCode = async () => {
    const res = await AuthService.setGroupInviteCode(accessToken, groupId)
    console.log('res_invite', res)
    console.log('inviteCode: ', res.inviteCode)
    setInviteCode(res.inviteCode)
  }
  React.useEffect(() =>{
    const getGroupInfo = async() =>{
        try{
            var accessToken = await AsyncStorage.getItem('@accessToken')
            var groupId = await AsyncStorage.getItem('@currentGroupId')
            setAccessToken(accessToken)
            setGroupId(groupId)
        }
        catch(e){
          console.log(e)
        }
        var res = await AuthService.getGroupInfo(accessToken, groupId)
        console.log('res_info', res)
        setGroupName(res.name)

    }
    if(isFocused)
        getGroupInfo()
  },[isFocused])
  return(
    <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>   

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
              {groupName}
            </Dialog.Title>
            <View height="7%" />
            <XStack height="30%" alignItems="center" >
              <Dialog.Title color={Colors.text} fontSize={20}>
                房號
              </Dialog.Title>
              <View width="5%" />
              <View bg={Colors.input_bg} width="35%" height="100%" alignItems="center" justifyContent="center" px="1%">
                <Dialog.Description color={Colors.text}>
                  {inviteCode}
                </Dialog.Description>
              </View>
              <Button bg={Colors.primary} onPress={copyToClipboard}>
                <FontAwesome5 name="copy" size={24} color="black"/>
              </Button> 
            </XStack>
            <View height="10%" />
            <Dialog.Close displayWhenAdapted asChild>
              <Button 
                  theme="active" 
                  aria-label="Close"
                  bg={Colors.button_primary} 
                  borderRadius={20}
                  width="40%">
                  close
              </Button> 
            </Dialog.Close>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>  
    <Link href="/group">return</Link>
    <Link href="/check_sum">check_sum</Link>

  </View>
  )

}
