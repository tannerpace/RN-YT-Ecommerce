import {View, Text, TextInput} from 'react-native';
import React from 'react';

export default function InputFieldComp({
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  onChangeText,
}) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderWidth: 2,
        marginBottom: 15,
        borderRadius: 30,
        paddingHorizontal: 15,
      }}>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={text => onChangeText(text)}
      />
    </View>
  );
}
