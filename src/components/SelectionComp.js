import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function SelectionComp({
  extraStyle,
  image,
  label,
  onPress,
  checked = false,
}) {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <View
        style={[
          {
            borderColor: '#D5D8DC',
            borderWidth: 1,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 5,
            flexDirection: 'row',
            height: 45,
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          extraStyle,
        ]}>
        <View>
          <Text>{label}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {checked ? (
            <AntDesign
              style={{marginRight: 10}}
              name="checkcircle"
              color={'#2ECC71'}
              size={20}
            />
          ) : null}
          {image}
        </View>
      </View>
    </TouchableOpacity>
  );
}
