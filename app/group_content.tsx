import React , { useEffect, useState } from 'react'
import { Text, View, Button} from 'tamagui'
import { Link } from 'expo-router'
import AuthService from '../services/auth/auth'
import { Colors } from '../constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage' 
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
export default function groupContentScreen(){
    const router = useRouter()
    const handleDeleteButton = async() => {
        try{
            var accessToken = await AsyncStorage.getItem('@accessToken')
            var groupId = await AsyncStorage.getItem('@currentGroup')
            console.log('currentGroup: ',groupId)
            console.log('accessToken: ', accessToken)
        }
        catch(e){
            console.log(e)
        }
        const res = await AuthService.deleteGroup(groupId, accessToken)
        if (res.code == null)
            Alert.alert('Delete success')
        router.push('/group')
        
    }
    return(
        <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>
            <Button onPress={handleDeleteButton}>
                Delete
            </Button>
            <Link href="/group"></Link>

        </View>
    )
    
}
