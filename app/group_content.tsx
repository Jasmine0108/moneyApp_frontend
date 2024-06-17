
import React from 'react'
import { View } from 'tamagui'
import { Link } from 'expo-router'
import { Colors } from '../constants/Colors'

import { useRouter } from 'expo-router'
export default function groupContentScreen(){
    const router = useRouter()
    return(
        <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>
            
            <Link href="/group">return</Link>
        </View>
    )
    
}
