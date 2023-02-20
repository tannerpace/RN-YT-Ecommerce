import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import {_getFromAsyncStorage} from '../../config/asyncStorage';

export default function SplashScreen({navigation}) {
  setTimeout(() => {
    //navigation.replace('WelcomeScreen');
    checkUser();
  }, 2000);

  async function checkUser() {
    const value = await _getFromAsyncStorage('user');
    if (!value) {
      navigation.replace('OnBoardingScreen');
    } else {
      navigation.replace('SideNavigation');
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/splashBg.png')}
      resizeMode={'cover'}
      style={{flex: 1, padding: 15}}>
      <Text
        style={{
          fontSize: 25,
          color: 'white',
          fontWeight: 'bold',
        }}>
        Ecommerce APP
      </Text>
    </ImageBackground>
  );
}
