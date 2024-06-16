import React from 'react'
import { Link } from 'expo-router'
import { View, Text, Button, Input } from 'tamagui' // or '@tamagui/core'
import { useRouter } from 'expo-router'
import { Colors } from '../constants/Colors'
import AuthService from '../services/auth/auth'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

function LoginScreen() {
  const router = useRouter()
  const [account, setAccount] = React.useState('')
  const [password, setPassword] = React.useState('')
  const input = [
    { content: '帳號', set: setAccount },
    { content: '密碼', set: setPassword },
  ]
  const handleLogin = async () => {
    const res = await AuthService.login(account, password)
    if (res.code && res.code != 0) {
      if (res.code == 5) {
        Alert.alert('Email not found.')
      }
      return
    }
    try {
      await AsyncStorage.setItem('@userId', res.userId)
      await AsyncStorage.setItem('@accessToken', res.accessToken)
      await AsyncStorage.setItem('@refreshToken', res.refreshToken)
    } catch (e) {
      console.log(e)
    }
    router.push('/group')
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
