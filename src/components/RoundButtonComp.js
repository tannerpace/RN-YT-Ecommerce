import {View, Text, TouchableOpacity} from 'react-native';
import {COLOR} from '../config/Colors';
import React from 'react';

export default function RoundButtonComp({
  label,
  border = false,
  onPress,
  width = '100%',
  marginTop = 0,
}) {
  return (
    <TouchableOpacity style={{marginTop: marginTop}} onPress={() => onPress()}>
      <View
        style={{
          backgroundColor: border ? 'white' : COLOR.blue,
          width: width,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 20,
          borderColor: 'black',
          borderWidth: border ? 1 : 0,
        }}>
        <Text
          style={{
            color: border ? 'black' : 'white',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
