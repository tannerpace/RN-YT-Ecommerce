import {View, Text, StatusBar, Image, Alert} from 'react-native';
import React from 'react';
import InputFieldComp from '../../components/InputFieldComp';
import RoundButtonComp from '../../components/RoundButtonComp';
import {toastMessage} from '../../config/AppTost';
import auth from '@react-native-firebase/auth';

export default function SignUpScreen() {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  async function signUp() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (reg.test(email) === false) {
      toastMessage('error', 'Please provide a valid email');
      return;
    }
    if (!password) {
      toastMessage('error', 'Please provide password');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error.message);
        Alert.alert('Error', error.message, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      });
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
      <StatusBar backgroundColor={'#fffdee'} />
      <View style={{flex: 0.5}}>
        <Image
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode={'cover'}
          source={require('../../assets/login.jpeg')}
        />
      </View>
      <View style={{flex: 0.5, backgroundColor: '#fffdee'}}>
        <Text
          style={{
            fontSize: 30,
            color: 'black',
            fontWeight: 'bold',
            marginLeft: 10,
          }}>
          Sing Up
        </Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <InputFieldComp
            placeholder={'email'}
            keyboardType={'email-address'}
            onChangeText={text => setEmail(text)}
          />
          <InputFieldComp
            placeholder={'password'}
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
          <RoundButtonComp
            label={'SignUp'}
            marginTop={30}
            onPress={() => signUp()}
          />
        </View>
      </View>
    </View>
  );
}
