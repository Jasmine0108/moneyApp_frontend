import React from 'react'
import { Link } from 'expo-router'
import { View, Text, Button, Input } from 'tamagui' // or '@tamagui/core'
import { useRouter } from 'expo-router'
import { Colors } from '../constants/Colors'
import AuthService from '../services/auth/auth'
import UserService from '../services/user/user'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../services/interface'

function LoginScreen() {
  const router = useRouter()
  const [account, setAccount] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [userInfo, setUserInfo] = React.useState<User>()
  const input = [
    { content: '帳號', set: setAccount },
    { content: '密碼', set: setPassword },
  ]
  const handleLogin = async () => {
    console.log('on login button pressed, data sent to backend: ')
    console.log('account: ', account)
    console.log('password: ', password)
    if(account.length == 0 ){
      Alert.alert('Account cannot be empty.')
    }
    else if(password.length == 0){
      Alert.alert('Password cannot be empty.')
    }
    else{
      const res = await AuthService.login(account, password)
      console.log('login_res', res)
      if (res=='') {
        Alert.alert('帳號或密碼錯誤')
        router.navigate('/')  
      }
      else {
        try {
          await AsyncStorage.setItem('@accessToken', res.accessToken)
          await AsyncStorage.setItem('@refreshToken', res.refreshToken)
          await AsyncStorage.setItem('@userId', res.userId)
        } catch (e) {
          console.log(e)
        }
        console.log('accessToken:', res.accessToken)
        console.log('userId:', res.userId)
        const res_user_info = await UserService.getUserInfo(res.accessToken, res.userId)
        console.log('res_user_info', res_user_info)
        console.log('res_user_info.avatarUrl', res_user_info.avatarUrl)
        var new_info: User = {id: res.userId, name: res_user_info.name, avatarUrl: res_user_info.avatarUrl}
        setUserInfo(new_info)
        try{
          await AsyncStorage.setItem(
            '@currentUser',
            JSON.stringify(new_info)
          )
        }
        catch(e){
          console.log(e)
        }
        
        if(res_user_info.name == "無名氏")
          router.navigate('/set_user_name')
        else
          router.push('/group')   
      }
    }  
  }
  
  return (
    <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>
      <Text fontSize="36" color={Colors.text} margin="5%">
        Monify
      </Text>
      {input.map((i, index) => (
        <Input
          key={index}
          placeholder={i.content}
          bg={Colors.input_bg}
          color={Colors.text}
          borderColor={Colors.border}
          borderRadius={20}
          width="80%"
          height="6%"
          padding={10}
          margin="3%"
          onChangeText={(t) => i.set(t)}
        />
      ))}

      <View flexDirection="row" alignItems="center">
        <Link href="/">
          <Text color={Colors.text} opacity={0.5} margin="3%">
            忘記密碼
          </Text>
        </Link>
        <View mx="25%" />
        <Link href="/register">
          <Text color={Colors.text} opacity={0.5} margin="3%">
            立即註冊
          </Text>
        </Link>
      </View>
      <View my="3%" />
      <Button
        color={Colors.text}
        bg={Colors.input_bg}
        margin="3%"
        borderColor={Colors.border}
        borderRadius={20}
        width="25%"
        onPress={() => handleLogin()}
      >
        登入
      </Button>
    </View>
  )
}
export default function mainScreen() {
  return (
    <View flex={1}>
      <LoginScreen />
    </View>
  )
}
