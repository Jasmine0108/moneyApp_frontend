import React from 'react';
import { Colors } from '../constants/Colors';
import { Link } from 'expo-router';
import { View, Text, Button, Input } from 'tamagui' // or '@tamagui/core'

const input=['帳號', '密碼']
export default function loginScreen(){
  return (
    <View flex={1} bg={Colors.bg} alignItems='center' py='30%'>
      <Text fontSize='36' color={Colors.text} margin='15%'>Monify</Text>
      {input.map((content) => (
        <Input
          placeholder={content}
          bg={Colors.input_bg}
          width='80%'
          padding={10}
          margin='3%'
        />
      ))}
      
      <View flexDirection='row' alignItems='center'>
        <Link href="/">
            <Text color={Colors.text} opacity={0.5} margin='3%'>忘記密碼</Text> 
        </Link>
        <View mx='25%'/>
        <Link href="/">
            <Text color={Colors.text} opacity={0.5} margin='3%'>立即註冊</Text> 
        </Link>
      </View>
      <View my='3%'/>
      <Button color={Colors.text} bg={Colors.button} margin='3%'>登入</Button>
    </View>
  )
}
