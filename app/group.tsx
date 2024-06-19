import React , { useEffect, useState } from 'react'
import { Text, View, Button, ScrollView, YStack, ListItem, CardBackground } from 'tamagui'
import { Link } from 'expo-router'
import AuthService from '../services/auth/auth'
import { Colors } from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage' 
import { useIsFocused } from '@react-navigation/native';
import { Alert } from 'react-native'


export default function groupScreen() {
  const isFocused = useIsFocused();
  const [groups, setGroups] = useState([]);
  const [groupIds, setGroupIds] = useState([]);

  const router = useRouter()
  const handleAddGroup = () => {
    router.push('/plus_group')
  }
  const handleEnterGroup = async(groupId: string, groupName: string) => {
    try {
      await AsyncStorage.setItem('@currentGroupId', groupId)
      await AsyncStorage.setItem('@currentGroupName', groupName)
    }
    catch(e){
      console.log(e)
    }
    router.push('/group_content')
  }

  const handleDeleteButton = async() => {
    try{
        var accessToken = await AsyncStorage.getItem('@accessToken')
        var groupId = await AsyncStorage.getItem('@currentGroupId')
    }
    catch(e){
      console.log(e)
    }
    const res = await AuthService.deleteGroup(groupId, accessToken)
    /*if (res.code == null)
        Alert.alert('Delete success')*/
    router.push('/group')
    
  }

  const handleLongPress = async(groupId: string, groupName: string) => {
    try {
      await AsyncStorage.setItem('@currentGroupName', groupName)
      await AsyncStorage.setItem('@currentGroupId', groupId) 
    }
    catch (e) {
      console.log(e)
    }
    Alert.alert(
      `Delete "${groupName}"`,
      '',
      [
        {
          text: 'Delete',
          onPress: () => handleDeleteButton(),
          style: 'destructive'
        },
        {
          text: 'Cancel',
          onPress: () => router.push('/group'),
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
      },
    )
  }

  useEffect(() => {
    const getGroups = async() =>{
      try{
        var accessToken = await AsyncStorage.getItem('@accessToken')
        //console.log('accesstoken: ', accessToken)
      }
      catch(e){
        console.log(e)
      }
      console.log(accessToken)
      const res = await AuthService.listGroup(accessToken)
      console.log('res', res)
      console.log('groups: ', res.groups) //groups
      let tmp_groups = []
      let tmp_groupIds = []
      
      for(var i = 0; i < res.groups.length; ++i){
        tmp_groups.push(res.groups[i].name)
        tmp_groupIds.push(res.groups[i].groupId)
      }
      setGroups(tmp_groups)
      setGroupIds(tmp_groupIds)
      console.log('new group: ',tmp_groups) 
  }

  if(isFocused)
    getGroups() 
  }, [isFocused]);
  
  return (

    <ScrollView flex={1} bg={Colors.bg}>
      <YStack>
        <ListItem key='add'>
          <View my="3%"></View>
        </ListItem>

        <ListItem>
          <Link href="/show_room">show_room</Link> 
        </ListItem>
          
        <ListItem>
          <Button 
            onPress={handleAddGroup}
            color={Colors.text} 
            bg={Colors.primary}
            width='90%'
            margin="3%"
            height={90}
          >
            <AntDesign name="pluscircleo" size={50} color={Colors.text} opacity={0.5}/>
          </Button>
        </ListItem>
        {groups.map((group_name, index) => (
          <ListItem key={index}>
            <Button
              key={index}
              bg={Colors.primary}
              margin="3%"
              width="90%"
              height={90} 
              onPress={() => handleEnterGroup(groupIds[index], group_name)}
              onLongPress={() => handleLongPress(groupIds[index], group_name)}
            >
              <Text color={Colors.text} scale={1.5} margin="3%">
                {group_name}
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
