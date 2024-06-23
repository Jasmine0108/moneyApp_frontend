import React from 'react'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import appConfig from '../tamagui.config'
import { TamaguiProvider, createTamagui } from 'tamagui'

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(appConfig)

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    // add this
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerTitle: 'LoginPage', headerShown: false }}
          />
          <Stack.Screen
            name="group"
            options={{
              headerTitle: 'Group',
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="register"
            options={{ headerTitle: 'RegisterPage', headerShown: false }}
          />
          <Stack.Screen
            name="create_group"
            options={{ headerTitle: 'InputGroupPage', headerShown: false }}
          />
          <Stack.Screen
            name="group_content"
            options={{ headerTitle: 'GroupContentPage', headerShown: false }}
          />
          <Stack.Screen
            name="group_balance"
            options={{ headerTitle: 'GroupBalancePage', headerShown: false }}
          />
          <Stack.Screen
            name="plus_group"
            options={{ headerTitle: 'plusGroupPage', headerShown: false }}
          />
          <Stack.Screen
            name="join_group"
            options={{ headerTitle: 'joinGroupPage', headerShown: false }}
          />
          
          <Stack.Screen
            name="check_sum"
            options={{ headerTitle: 'checkSumPage', headerShown: false }}
          />
          <Stack.Screen
            name="set_user_name"
            options={{ headerTitle: 'setUserNamePage', headerShown: false }}
          />
         
    
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  )
}
