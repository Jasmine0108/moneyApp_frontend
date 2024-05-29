import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Feather } from '@expo/vector-icons';
const App = () => {
  const [payer, setPayer] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const payerItems = [
    { id: 'payer1', name: '付款人1' },
    { id: 'payer2', name: '付款人2' },
  ];

  const participantItems = [
    { id: 'participant1', name: '分帳者1' },
    { id: 'participant2', name: '分帳者2' },
  ];

  // Function to handle changes in the payer selection
  const onPayerChange = (selectedPayer) => {
    setPayer(selectedPayer);
  };

  // Function to handle changes in the participants selection
  const onParticipantsChange = (selectedParticipants) => {
    setParticipants(selectedParticipants);
  };

  // Icon component to render Feather icons
  const Icon = ({ name, size, style }) => (
    <Feather name={name} size={size} style={style} />
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.side}>
            <Text style={styles.numberText}>1</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.side}>
            <Text style={styles.numberText}>2</Text>
          </View>
        </View>

        {/* 中間 Section */}
        <View style={styles.middleSection}>
          {/* Item Input */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="clipboard" size={20} style={styles.icon} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="品項"
              placeholderTextColor={"black"}
              value={item}
              onChangeText={setItem}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="dollar-sign" size={20} style={styles.icon} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="金額"
              placeholderTextColor={"black"}
              value={amount}
              keyboardType="numeric"
              onChangeText={setAmount}
            />
          </View>

          {/* Payer Selection */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="users" size={20} style={styles.icon} />
            </View>
            <SectionedMultiSelect
              items={payerItems}
              uniqueKey="id"
              selectText="選擇支付者"
              searchPlaceholderText="Search Payer"
              onSelectedItemsChange={onPayerChange}
              selectedItems={payer}
              styles={{
                selectToggle: {
                  width: '80%', // 設置寬度以匹配其他輸入框
                  backgroundColor: 'white', // 背景色
                  borderColor: 'gray', // 邊框顏色
                  borderWidth: 1, // 邊框寬度
                  borderRadius: 5, // 圓角
                  paddingHorizontal: 10, // 水平內邊距
                  height: 40, // 高度
                  marginBottom: 10, // 底部間距
                },
                // itemText: {
                //   color: 'black', // 選項文字顏色
                // },
                // selectedItemText: {
                //   color: 'black', // 已選項目文字顏色
                // },
                // confirmText: {
                //   color: 'blue', // 確認按鈕文字顏色
                // },
              }}
              IconRenderer={Icon}
            />
          </View>

          {/* Participants Selection */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="users" size={20} style={styles.icon} />
            </View>
            <SectionedMultiSelect
              items={participantItems}
              uniqueKey="id"
              selectText="選擇分帳者"
              searchPlaceholderText="Search Participants"
              onSelectedItemsChange={onParticipantsChange}
              selectedItems={participants}
              styles={{
                selectToggle: {
                  width: '80%', // 設置寬度以匹配其他輸入框
                  backgroundColor: 'white', // 背景色
                  borderColor: 'gray', // 邊框顏色
                  borderWidth: 1, // 邊框寬度
                  borderRadius: 5, // 圓角
                  paddingHorizontal: 10, // 水平內邊距
                  height: 40, // 高度
                  marginBottom: 10, // 底部間距
                },
                // itemText: {
                //   color: 'black', // 選項文字顏色
                // },
                // selectedItemText: {
                //   color: 'black', // 已選項目文字顏色
                // },
                // confirmText: {
                //   color: 'blue', // 確認按鈕文字顏色
                // },
              }}
              IconRenderer={Icon}
            />
          </View>

          {/* Date Input */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="calendar" size={20} style={styles.icon} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={date}
              onChangeText={setDate}
            />
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>Bottom Section</Text>
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
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    width: '80%',
    marginBottom: 10,
  },
  side: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalLine: {
    width: 1,
    backgroundColor: 'black',
  },
  numberText: {
    fontSize: 24,
  },
  middleSection: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
    width: '80%'
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
  },

  bottomSection: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 18,
  },
});

export default App;
