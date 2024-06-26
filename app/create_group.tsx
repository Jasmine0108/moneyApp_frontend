import React from 'react'
import { Text, View, Button, Input } from 'tamagui'
import { Colors } from '../constants/Colors'
import AuthService from '../services/auth/auth'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function inputGroupScreen() {
  const router = useRouter()
  const [groupName, setGroupName] = React.useState('')

  const handleConfirmButton = async () => {
    if (groupName.length > 20) {
      Alert.alert('Group name cannot exceed more then 20 words')
      router.navigate('/create_group')
    } else if (groupName.length == 0) {
      Alert.alert('Group name cannot be empty')
      router.navigate('/create_group')
    } else if (groupName != null) {
      try {
        var accessToken = await AsyncStorage.getItem('@accessToken')
        //console.log('accessToken: ', accessToken)
      } catch (e) {
        console.log(e)
      }
      console.log('on confirm button pressed, data sent to backend: ')
      console.log('accessToken', accessToken)
      console.log('groupName', groupName)
      const res = await AuthService.createGroup(groupName, accessToken)
      //console.log('groupId: ', res.groupId)

      try {
        //await AsyncStorage.setItem('@currentGroupName', groupName)
        await AsyncStorage.setItem('@currentGroupId', res.groupId)
      } catch (e) {
        console.log(e)
      }

      /*
        if(res.code != 0)
            Alert.alert('Create success.')
        else
            Alert.alert('Create failed. Please try again.')*/
      router.navigate('/group')
    } else {
      Alert.alert('Group name undefined.Please try again.')
      router.navigate('/create_group')
    }
  }
  const handleCancelButton = () => {
    router.navigate('/group')
  }

  return (
    <View flex={1} bg={Colors.bg} alignItems="center" justifyContent="center">
      <View
        bg={Colors.primary}
        height="25%"
        width="85%"
        alignItems="center"
        justifyContent="center"
        borderRadius={15}
      >
        <Input
          key="add_group"
          placeholder="請輸入群組名稱"
          bg={Colors.input_bg}
          width="80%"
          mt="10%"
          onChangeText={(t) => setGroupName(t)}
        />
        <View flexDirection="row" mt="15%">
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
            <Text color={Colors.text} margin="1%">
              確定
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
