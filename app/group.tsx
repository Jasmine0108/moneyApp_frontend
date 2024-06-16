import React from 'react'
import { Text, View, Button } from 'tamagui'
import { Link } from 'expo-router'
import { Colors } from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router'

export default function groupScreen() {
  const groups=['群組名稱'] //之後會連接到資料庫
  const router = useRouter()
  const handleAddGroup = () => {
    router.push('/input_group')
  }

  return (
    <View flex={1} bg={Colors.bg} alignItems="center" pt='40%'>
      <Button 
        onPress={handleAddGroup}
        color={Colors.text} 
        bg={Colors.primary}
        margin='3%' 
        width='90%'
        height='15%'
      >
        <AntDesign name="pluscircleo" size={50} color={Colors.text} opacity={0.5}/>
      </Button>
      {groups.map((group_name, index) => (
        <Button
          key={index}
          bg={Colors.primary}
          margin="6%"
          width="90%"
          height='15%'
          
        >
          <Text color={Colors.text} scale={1.5} margin="3%">
            {group_name}
          </Text>
        </Button>
      ))}
      <View margin="3%"></View>
      <Link href="/">Logout</Link>
      
      
    </View>
  )
}

/*
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
*/
