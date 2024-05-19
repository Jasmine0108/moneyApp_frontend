import React from 'react';
import { Colors } from '../constants/Colors';
import { Link } from 'expo-router';
import { View, Text, Button, Input } from 'tamagui' // or '@tamagui/core'

const input=['帳號', '密碼', '確認密碼']
export default function loginScreen(){
  return (
    <View flex={1} bg={Colors.bg} py='30%' px='3%' alignItems='center'>
      <Text fontSize='36' color={Colors.text} margin='15%' textAlign='center'>Monify</Text>
     
        {input.map((content) => (
          <Input
            key={content}
            placeholder={content}
            bg={Colors.input_bg}
            width='80%'
            padding={10}
            margin='3%'
            alignItems='center'  
          />
        ))}
      
      <View my='1%'/>
      <Button color={Colors.text} bg={Colors.button} margin='3%' width='30%'>註冊</Button>
      <Link href="/">
        <Text color={Colors.text} opacity={0.5} margin='10%' textAlign='right'>有帳號了嗎?立即登入</Text> 
      </Link>
    </View>

  )
}
