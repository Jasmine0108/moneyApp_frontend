import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link } from 'expo-router'
import axios from 'axios'

const App = () => {
  const [payer, setPayer] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [leftNumber, setLeftNumber] = useState(0);
  const [rightNumber, setRightNumber] = useState(0);

  const fetchLeftNumber = async () => {
    try {
      const response = await axios.post('http://api.monify.dev:8081/v1/groups_bill');
      setLeftNumber(response.data.leftNumber); 
    } catch (error) {
      console.error('Error fetching left number:', error);
    }
  };

  useEffect(() => {
    fetchLeftNumber();
  }, []);



  const payerItems = [
    { id: 'payer1', name: '付款人1' },
    { id: 'payer2', name: '付款人2' },
    <Button title="選擇多人"/>
  ];

  const participantItems = [
    { id: 'participant1', name: '分帳者1' },
    { id: 'participant2', name: '分帳者2' },
  ];

  const onPayerChange = (selectedPayer) => {
    setPayer(selectedPayer);
  };

  const onParticipantsChange = (selectedParticipants) => {
    setParticipants(selectedParticipants);
  };

  const IconRenderer = ({ name, style }) => {
    //return <Feather name="x-circle" size={15} style={[styles.icon, style]} />;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* 頂部 */}
        <View style={styles.topSection}>
          <View style={styles.side}>
            <Text style={{ fontSize: 30 }}>{leftNumber}</Text>
          </View>
          <View style={styles.top_iconContainer}>
              <Feather name="users" size={20} style={styles.icon}  />
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.side}>
            <Text style={{ fontSize: 30 }}>{rightNumber}</Text>
          </View>
          <View style={styles.top_iconContainer}>
              <Feather name="user" size={20} style={styles.icon} />
          </View>
          
        </View>

        {/* 中間 */}
        <View style={styles.middleSection}>
          {/* 品項輸入 */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="clipboard" size={20} style={styles.icon} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="品項"
              placeholderTextColor="black"
              value={item}
              onChangeText={setItem}
            />
          </View>

          {/* 金額輸入 */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="dollar-sign" size={20} style={styles.icon} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="金額"
              placeholderTextColor="black"
              value={amount}
              keyboardType="numeric"
              onChangeText={setAmount}
            />
          </View>

          {/* 付款人 */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="users" size={20} style={styles.icon} />
            </View>
            <View style={styles.multiSelectContainer}>
              <MultiSelect
                items={payerItems}
                uniqueKey="id"
                displayKey="name"
                selectedItems={payer}
                onSelectedItemsChange={onPayerChange}
                selectText="付款人"
              />
            </View>
          </View>

          {/* 分帳者 */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="users" size={20} style={styles.icon} />
            </View>
            <View style={styles.multiSelectContainer}>
              
              <MultiSelect
                items={participantItems}
                uniqueKey="id"
                displayKey="name"
                selectedItems={participants}
                onSelectedItemsChange={onParticipantsChange}
                selectText="分帳者"
              />
            </View>
          </View>

          {/* 日期輸入 */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="calendar" size={20} style={styles.icon} />
            </View>
            <View style={styles.multiSelectContainer}>
              <Button onPress={showDatepicker} title="Show date picker!" />
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  onChange={onChange}
                  
                />
              )}
              <Text> {String(date)}</Text>
            </View>
            
            {/* <Text>selected: {date.toLocaleString()}</Text> */}
          </View>
          <View>
          <TouchableOpacity style={styles.button} >
            <Text>確定</Text>
          </TouchableOpacity>
          </View>
        </View>

        {/* 底部部分 */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>帳單</Text>
          <View style={styles.horizontalLine} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#E0E0E0',
    justifyContent: 'flex-end',
    //alignItems: 'flex-end',
    marginBottom: 10,
    borderRadius: 10,
  },
  side: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  top_iconContainer: {
    marginRight: 10,
    marginBottom: '5%',
    alignSelf: 'flex-end',
  },
  verticalLine: {
    width: 1,
    backgroundColor: 'black',
    height: '90%',
    alignSelf: 'center',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'black',
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  middleSection: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
    width: '90%',
  },
  iconContainer: {
    marginRight: 10,
    
  },
  icon: {
    color: 'black',
  },
  input: {
    height: 40,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  
  multiSelectContainer: {
    flex: 1,
    flexDirection: 'row',
    
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 5,
  },
  rightIcon: {
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  dateText: {
    color: 'black',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    width: 100,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
   // alignItems: 'center',
    borderRadius: 10,
  },
  bottomText: {
    fontSize: 18,
    flexDirection: 'row',
    alignItems: 'flex-start', // 对齐到顶部
    justifyContent: 'flex-start', // 对齐到左侧
    marginLeft: 20,
  },
});

export default App;