import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Link } from 'expo-router';
import appConfig from '../tamagui.config'
import { TamaguiProvider, createTamagui } from 'tamagui' 

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(appConfig)

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default function mainScreen(){
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <View style={styles.container}>
        <Text>test</Text>
        <Link href="/group">go to group</Link>
      </View>
    </TamaguiProvider>
    
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fff0',
    alignItems: 'center', //horizontal center
    justifyContent: 'center', //straight center
    paddingVertical: 20
    
  }
});
