import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useEffect, useState} from 'react';
import {View, Image, Text} from 'react-native';
import {_getFromAsyncStorage} from '../../config/asyncStorage';

export default function CustomDrawerContent(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    const userData = await _getFromAsyncStorage('user');
    if (userData) {
      let userJson = JSON.parse(userData);
      setUser(userJson);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#2E86C1'}}>
      <View
        style={{
          padding: 15,
        }}>
        <View
          style={{
            width: 70,
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 35,
          }}>
          <Image
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
            }}
            source={{uri: user.user.profileImage}}
          />
        </View>
        <Text style={{marginTop: 5, color: 'white', fontSize: 18}}>
          {user !== undefined ? user.user.name : ''}
        </Text>
        <Text style={{color: 'white'}}>
          {user !== undefined ? user.user.email : ''}
        </Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}
