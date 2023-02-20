import {View, Text} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-gesture-handler';

export default function FormInputText({
  placeholder,
  extraStyle,
  onChangeText,
  keyboardType = 'text',
}) {
  return (
    <View
      style={[
        {
          borderBottomColor: '#D5D8DC',
          borderBottomWidth: 1,
        },
        extraStyle,
      ]}>
      <TextInput
        placeholder={placeholder}
        onChangeText={text => onChangeText(text)}
        keyboardType={keyboardType}
      />
    </View>
  );
}
