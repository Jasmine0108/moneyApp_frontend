import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';

const App = () => {
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const handleConfirm = () => {
    if (name.trim() === '') {
      Alert.alert('警告', '名稱不能為空');
    } else {
      navigation.navigate("g_info" as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="名稱"
            placeholderTextColor="black"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="取消" buttonStyle={{backgroundColor: 'no'}} titleStyle={{ color: 'black' }} onPress={() => navigation.goBack()} />
          <Button title="確定" buttonStyle={{backgroundColor: 'no'}} titleStyle={{ color: 'black' }} onPress={handleConfirm} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  rectangle: {
    width: '80%',
    height: 200,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginLeft: 40,
    borderRadius: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    width: '80%',
  },
  input: {
    // borderWidth: 1,
    // borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
});

export default App;
