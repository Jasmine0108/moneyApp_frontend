import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Link } from 'expo-router';

export default function mainScreen(){
  return (
    <View style={styles.container}>
      <Text>test</Text>
      <Link href="/group">go to group</Link>
    </View>
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
