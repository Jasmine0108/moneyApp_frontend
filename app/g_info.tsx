import React, { useState } from 'react';
import { ScrollView, View, Text, Input, Button, styled, XStack, YStack, EnsureFlexed } from 'tamagui';
import MultiSelect from 'react-native-multiple-select';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

const App = () => {
  const [payer, setPayer] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [leftNumber, setLeftNumber] = useState(0);
  const [rightNumber, setRightNumber] = useState(0);

  
  const ShadowView = styled(View, {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    //elevation: 5,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  });

  const getSubmit = (value1) => { 
    console.log('new submit value***', value1) 
    router.push('')
  }
  const onPayerChange = (selectedPayer) => {
    setPayer(selectedPayer);
  };
  
  const onParticipantsChange = (selectedParticipants) => {
    setParticipants(selectedParticipants);
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
  const formatDate = (date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };
  const onpressList = ()=>{
    alert("press list!")
  }
  const onpressSort = ()=>{
    alert("press sort")
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
        {/* 頂部 */}
        <ShadowView style={{ height:'30%',flexDirection: 'row', backgroundColor: '#E0DDD6', justifyContent: 'center', alignItems: 'center', width: '80%', borderRadius: 10, marginBottom: 20 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 30, color: 'black' }}>{leftNumber}</Text>
          </View>
          <Feather name="users" size={25} style={{alignSelf:'flex-end', marginBottom:10, marginRight:10}}/>
          <View style={{ width: 1.5, backgroundColor: 'black', height: '100%', alignSelf: 'center' }} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 30, color: 'black' }}>{rightNumber}</Text>
          </View>
          <Feather name="user" size={25} style={{alignSelf:'flex-end', marginBottom:10, marginRight:10}}/>
        </ShadowView>

        {/* 中間區域 */}
        <ShadowView style={{ height:'70%',backgroundColor: '#E0DDD6', justifyContent: 'center', alignItems: 'center', width: '80%', borderRadius: 10, paddingVertical: 20, marginBottom: 20 }}>
          {/* 品項 */}
          <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Feather name="clipboard" size={20} style={{ marginRight: 10 }} />
            <Input
              style={{ flex: 1, backgroundColor: 'white', textAlign: 'left', paddingVertical: 10, borderRadius: 5 }}
              placeholder="品項"
              placeholderTextColor="black"
              value={item}
              onChangeText={setItem}
            />
          </View>
          {/* 金額 */}
          <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Feather name="dollar-sign" size={20} style={{ marginRight: 10 }} />
            <Input
              style={{ flex: 1, backgroundColor: 'white', textAlign: 'left', paddingVertical: 10, borderRadius: 5 }}
              placeholder="金額"
              placeholderTextColor="black"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* 付款人 */}
          <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Feather name="users" size={20} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <MultiSelect
                submitButtonText='選擇多人'
                items={[
                  { id: '1', name: 'Alice' },
                  { id: '2', name: 'Bob' }
                ]}
                uniqueKey="id"
                displayKey="name"
                selectedItems={payer}
                onSelectedItemsChange={onPayerChange}
                onToggleList={()=>(console.log("aaaa"))}
                selectText="  付款人"
                styleDropdownMenu={{ backgroundColor: 'white' }}
                onSubmitclick={(value1) => getSubmit(value1)}
                searchInputStyle={{ height: 0 }} // This hides the search input by reducing its height to zero
                customSearchInputStyle={{ height: 0 }} // Ensuring the custom search input style also hides the input
                searchIcon={() => null} // This renders nothing for the search icon
                // styleMainWrapper={{
                //   backgroundColor: 'white',
                //   borderRadius: 5,
                  
                //   paddingVertical: 10,
                //   paddingHorizontal: 12,
                // }}
              />
              
            </View>
          </View>

          {/* 分帳者 */}
          <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Feather name="users" size={20} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }} borderRadius="20px">
              <MultiSelect 
               
                items={participants}
                uniqueKey="id"
                displayKey="name"
                selectedItems={participants}
                onSelectedItemsChange={onParticipantsChange}
                selectText="  分帳者"
                styleDropdownMenu={{ backgroundColor: 'white' }}
                onSubmitclick={(value1) => getSubmit(value1)}
                searchInputStyle={{ height: 0 }} // This hides the search input by reducing its height to zero
                customSearchInputStyle={{ height: 0 }} // Ensuring the custom search input style also hides the input
                searchIcon={() => null}
                // styleMainWrapper={{
                //   backgroundColor: 'white',
                //   borderRadius: 5,
                  
                //   paddingVertical: 10,
                //   paddingHorizontal: 12,
                // }}
              />
            </View>
          </View>

          {/* 日期 */}
          <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="calendar" size={20} style={{ marginRight: 10 }} />
            <Button onPress={showDatepicker} style={{ flex: 1 }}>
              <Text>{formatDate(date)}</Text>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  onChange={onChange}
                />
              )}
            </Button>
          </View>
          <View style={{marginTop:20}}>
            <Button style={{borderRadius:40, shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84,}}>
                確定</Button>
          </View>
        </ShadowView>

        {/* 底部區域 */}
        <ShadowView style={{ backgroundColor: '#E0DDD6', borderRadius: 10, padding: 20, width: '80%'}}>
          {/* Left Section */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <XStack style={{ alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 20, color: 'black' }}>帳單</Text>
            </XStack>
            
            {/* Center Section */}
            <XStack style={{ alignItems: 'center' }}>
              <Button style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, borderRadius: 30 }}>
                餘額
              </Button>
            </XStack>
            
            {/* Right Section */}
            <XStack>
              <XStack onPress={onpressList}>
                <Feather name="list" size={25} />
              </XStack>
              <XStack onPress={onpressSort}>
              <Feather name="chevrons-down" size={25}/>
              </XStack>
            </XStack>
            
            

          </View>
          
          <View style={{ height: 1.5, backgroundColor: 'black', width: '100%', alignSelf: 'center' , marginTop:20}} />
        </ShadowView>

      </View>
    </ScrollView>
  );
};

export default App;
