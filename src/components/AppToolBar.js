import {View, Text} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default function AppToolBar({navigation, label}) {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: '#2E86C1',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{flex: 0.2}}>
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <Ionicons name="reorder-three-outline" size={28} color="white" />
        </TouchableWithoutFeedback>
      </View>
      <View style={{flex: 0.8}}>
        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
          {label}
        </Text>
      </View>
    </View>
  );
}
