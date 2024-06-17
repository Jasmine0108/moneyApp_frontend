import React , { useEffect, useState } from 'react'
import { Text, View, Button, ScrollView, YStack, ListItem } from 'tamagui'
import { Link } from 'expo-router'
import AuthService from '../services/auth/auth'
import { Colors } from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage' 
import { useIsFocused } from '@react-navigation/native';


export default function groupScreen() {
  const isFocused = useIsFocused();
  const [groups, setGroups] = useState([]);
  const [groupIds, setGroupIds] = useState([]);

  const router = useRouter()
   
  const handleAddGroup = () => {
    router.push('/input_group')
  }

  const handleEnterGroup = async(groupId: string) => {
    
    try {
      await AsyncStorage.setItem('@currentGroup', groupId)
      //console.log('current-set:', groupId)
    }
    catch(e){
      console.log(e)
    }
    router.push('/group_content')
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
      const res = await AuthService.listGroup(accessToken)
      //console.log('res', res)
      console.log('groups: ', res.groups)
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
            margin="5%"
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
              margin="5%"
              width="90%"
              height={90} 
              onPress={() => handleEnterGroup(groupIds[index])}
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
