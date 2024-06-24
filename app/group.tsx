import React, { useEffect, useState } from 'react'
import { Text, View, Button, ScrollView, YStack, ListItem } from 'tamagui'
import { Link } from 'expo-router'
import AuthService from '../services/auth/auth'
import { Colors } from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { Alert } from 'react-native'

interface Group {
  groupId: string
  name: string
  description: string
  avatarUrl: string
}

export default function groupScreen() {
  const isFocused = useIsFocused()
  const [groups, setGroups] = useState<Group[]>([])
  const [groupIds, setGroupIds] = useState([])

  const router = useRouter()
  useEffect(() => {
    if (isFocused) getGroups()
  }, [isFocused])

  const getGroups = async () => {
    try {
      var accessToken = await AsyncStorage.getItem('@accessToken')
    } catch (e) {
      console.log(e)
    }
    const res = await AuthService.listGroup(accessToken)
    //console.log('res', res)
    let tmp_groups = []
    let tmp_groupIds = []
    console.log('on entering the page, received data from backend: ')
    console.log('group participted in: ', res)
    for (var i = 0; i < res.groups.length; ++i) {
      tmp_groups.push(res.groups[i])
      tmp_groupIds.push(res.groups[i].groupId)
    }
    setGroups(tmp_groups)
    setGroupIds(tmp_groupIds)
    //console.log('new group: ', tmp_groups)
  }
  const handleAddGroup = () => {
    router.push('/plus_group')
  }
  const handleEnterGroup = async (index: number) => {
    try {
      await AsyncStorage.setItem('@currentGroup', JSON.stringify(groups[index]))
      //await AsyncStorage.setItem('@currentGroupId', groupId)
      //await AsyncStorage.setItem('@currentGroupName', groupName)
    } catch (e) {
      console.log(e)
    }
    router.push('/group_content')
  }

  const handleDeleteButton = async () => {
    try {
      var accessToken = await AsyncStorage.getItem('@accessToken')
      var _group = await AsyncStorage.getItem('@currentGroup')
    } catch (e) {
      console.log(e)
    }
    var _groupId = JSON.parse(_group).groupId
    //console.log('_groupId', _group)
    const res = await AuthService.deleteGroup(_groupId, accessToken)
    /*if (res.code == null)
        Alert.alert('Delete success')*/
    getGroups()
    router.navigate('/group')
  }

  const handleLongPress = async (index: number) => {
    try {
      //console.log('e')
      //console.log('stringify', groups[index])
      await AsyncStorage.setItem('@currentGroup', JSON.stringify(groups[index]))
      //handleDeleteButton()
      //await AsyncStorage.setItem('@currentGroupName', groupName)
      //await AsyncStorage.setItem('@currentGroupId', groupId)
    } catch (e) {
      console.log(e)
    }
    Alert.alert(
      `Delete "${groups[index].name}"`,
      '',
      [
        {
          text: 'Delete',
          onPress: () => handleDeleteButton(),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          onPress: () => router.navigate('/group'),
          style: 'cancel',
        },
      ],
      {
        cancelable: false,
        /*
        onDismiss: () =>
          Alert.alert(
            'This alert was dismissed by tapping outside of the alert dialog.',
          ),*/
      }
    )
  }

  return (
    <ScrollView flex={1} bg={Colors.bg}>
      <YStack>
        <ListItem key="add">
          <View my="3%"></View>
        </ListItem>
        <ListItem>
          <Button
            onPress={handleAddGroup}
            color={Colors.text}
            bg={Colors.primary}
            width="90%"
            margin="3%"
            height={90}
          >
            <AntDesign
              name="pluscircleo"
              size={50}
              color={Colors.text}
              opacity={0.5}
            />
          </Button>
        </ListItem>
        {groups.map((_group, index) => (
          <ListItem key={index}>
            <Button
              key={index}
              bg={Colors.primary}
              margin="3%"
              width="90%"
              height={90}
              onPress={() => handleEnterGroup(index)}
              onLongPress={() => handleLongPress(index)}
            >
              <Text color={Colors.text} scale={1.5} margin="3%">
                {_group.name}
              </Text>
            </Button>
          </ListItem>
        ))}

        <ListItem>
          <Link href="/">Logout</Link>
        </ListItem>
      </YStack>
    </ScrollView>
  )
}
