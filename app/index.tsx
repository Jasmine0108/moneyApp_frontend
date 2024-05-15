import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
export default function mainScreen(){
  return (
    <View style={styles.container}>
      <Text>test</Text>
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
