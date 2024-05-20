import React from 'react'
import { Text, View } from 'tamagui'
import { Link } from 'expo-router'
import { Colors } from '../constants/Colors'

export default function mainScreen() {
  return (
    <View flex={1} bg={Colors.bg} alignItems="center" justifyContent="center">
      <Text>group</Text>
      <Link href="/">Logout</Link>
    </View>
  )
}
