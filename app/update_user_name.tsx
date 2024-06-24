import React, { useEffect, useState } from 'react'
import { Text, View, Button, Input, Avatar } from 'tamagui'
import { Colors } from '../constants/Colors'
import UserService from '../services/user/user'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../services/interface'
import { useIsFocused } from '@react-navigation/native'

export default function inputGroupScreen() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [user, setUser] = useState<User>()
  const [avatar, setAvatar] = useState('')
  const isFocused = useIsFocused()

  const getUserInfo = async () => {
    try {
      var currentUser_res = await AsyncStorage.getItem('@currentUser')
    } catch (e) {
      console.log(e)
    }
    //console.log('currentUser_res', currentUser_res)
    var currentUser = JSON.parse(currentUser_res)
    console.log('old_user', currentUser.name)
    setUser(currentUser)
    setAvatar(`${currentUser.avatarUrl}`)
  }
  useEffect(() => {
    if (isFocused) getUserInfo()
  }, [isFocused])

  const handleConfirmButton = async () => {
    if (userName.length > 10) {
      Alert.alert('User name cannot exceed more then 10 words')
      router.navigate('/set_user_name')
    } else if (userName.length == 0) {
      Alert.alert('User name cannnot be empty.')
      router.navigate('/set_user_name')
    } else {
      try {
        var accessToken = await AsyncStorage.getItem('@accessToken')
      } catch (e) {
        console.log(e)
      }
      const res = await UserService.setUserName(accessToken, userName)
      console.log('on confirm button pressed, data sent to backend: ')
      console.log('accessToken', accessToken)
      var new_info: User = {
        id: user.id,
        name: userName,
        avatarUrl: user.avatarUrl,
      }
      setUser(new_info)
      console.log('new_userName', new_info.name)
      setAvatar(`"${user.avatarUrl}"`)
      await AsyncStorage.setItem('@currentUser', JSON.stringify(user))
      router.push('/group')
    }
  }

  return (
    <View flex={1} bg={Colors.bg} alignItems="center" justifyContent="center">
      <View
        bg={Colors.primary}
        height="40%"
        width="85%"
        alignItems="center"
        justifyContent="center"
        borderRadius={15}
      >
        {avatar ? (
          <Avatar circular size="$10">
            <Avatar.Image src={avatar} />
            <Avatar.Fallback bc="red" />
          </Avatar>
        ) : (
          <Text />
        )}

        <Input
          key="add_group"
          placeholder="請輸入暱稱"
          bg={Colors.input_bg}
          borderColor="#493F36"
          borderWidth="$0.5"
          width="80%"
          mt="8%"
          onChangeText={(t) => setUserName(t)}
        />
        <Button
          bg="#C2BFB9"
          width="35%"
          mt="10%"
          borderRadius={20}
          onPress={handleConfirmButton}
        >
          <Text color={Colors.text} margin="1%">
            確定
          </Text>
        </Button>
      </View>
    </View>
  )
}
