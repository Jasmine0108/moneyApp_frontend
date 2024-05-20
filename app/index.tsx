import React from 'react'
import { StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { View, Text, Button, Input } from 'tamagui' // or '@tamagui/core'
import { useRouter } from 'expo-router'
import { Colors } from '../constants/Colors'

const input = ['帳號', '密碼']
function LoginScreen() {
  const router = useRouter()
  const handleLogin = () => {
    router.push('/group')
  }
  return (
    <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>
      <Text fontSize="36" color={Colors.text} margin="15%">
        Monify
      </Text>
      {input.map((content) => (
        <Input
          key={content}
          placeholder={content}
          bg={Colors.input_bg}
          width="80%"
          padding={10}
          margin="3%"
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
        bg={Colors.button}
        margin="3%"
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
      {/* <Link href="/group">go to group</Link> */}
      {/* <View my="1%" /> */}
      {/* <Link href="/login">login</Link> */}
      {/* <View my="1%" /> */}
      {/* <Link href="/register">register</Link> */}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fff0',
    alignItems: 'center', //horizontal center
    justifyContent: 'center', //straight center
    paddingVertical: 20,
  },
})
