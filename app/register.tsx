import React from 'react'
import { Colors } from '../constants/Colors'
import { Link } from 'expo-router'
import { View, Text, Button, Input } from 'tamagui' // or '@tamagui/core'
import AuthService from '../services/auth/auth'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'

export default function loginScreen() {
  const router = useRouter()
  const [account, setAccount] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [confirmPass, setConfirmPass] = React.useState('')
  const [passError, setPassError] = React.useState(false)
  const handleRegister = async () => {
    if (pass !== confirmPass) {
      console.log('密碼不一致')
      setPassError(true)
    }
    console.log('on regirter button pressed, data sent to backend: ')
    console.log('account: ', account)
    console.log('password: ', pass)
    const res = await AuthService.register(account, pass)
    console.log('res_register', res)
    if(account.length == 0 ){
      Alert.alert('Account cannot be empty.')
    }
    else if(pass.length == 0){
      Alert.alert('Password cannot be empty.')
    }
    else if(confirmPass.length == 0){
      Alert.alert('Confirm password cannot be empty.')
    }
    else{
      if (res=="register_error") {
        /*
        if (res.message === 'Email already exists.') {
          Alert.alert('Email already exists.')
          router.navigate('/')
        } else {
          Alert.alert('Register failed. Please try again.')
        }*/
        Alert.alert('Email already exists.')
      }
      
      else {
        Alert.alert('Register success.')
        router.navigate('/')
      }
    }  
  }
  
  const input = [
    { content: '帳號', set: setAccount },
    { content: '密碼', set: setPass },
    { content: '確認密碼', set: setConfirmPass },
  ]
  return (
    <View flex={1} bg={Colors.bg} py="30%" px="3%" alignItems="center">
      <Text fontSize="36" color={Colors.text} margin="15%" textAlign="center">
        Monify
      </Text>

      {passError && (
        <Text color={Colors.error} opacity={0.5} margin="3%" textAlign="left">
          Password not match
        </Text>
      )}

      {input.map((i) => (
        <Input
          key={i.content}
          placeholder={i.content}
          bg={Colors.input_bg}
          color={Colors.text}
          borderColor={Colors.border}
          borderRadius={20}
          width="80%"
          height="8%"
          padding={10}
          margin="3%"
          alignItems="center"
          onChangeText={(t) => i.set(t)}
        />
      ))}

      <View my="1%" />
      <Button
        color={Colors.text}
        bg={Colors.input_bg}
        margin="3%"
        width="25%"
        borderColor={Colors.border}
        borderRadius={20}
        onPress={() => handleRegister()}
      >
        註冊
      </Button>
      <Link href="/">
        <Text color={Colors.text} opacity={0.5} margin="10%" textAlign="right">
          有帳號了嗎?立即登入
        </Text>
      </Link>
    </View>
  )
}
