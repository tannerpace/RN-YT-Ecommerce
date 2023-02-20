import {View, Text, Image, StatusBar} from 'react-native';
import React from 'react';
import RoundButtonComp from '../../components/RoundButtonComp';
import FullRoundButtonComp from '../../components/FullRoundButtonComp';
import {_signInWithGoogle} from '../../config/firebase/GoogleSignIn';
import AppLoaderSpinner from '../../config/AppLoader';
import {toastMessage} from '../../config/AppTost';
import {axiosClient, SIGN_IN} from '../../config/api';
import {_storeIntoAsyncStorage} from '../../config/asyncStorage';

export default function SiginInScreen({navigation}) {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  async function googleSignIn() {
    _signInWithGoogle().then(data => {
      if (!data) {
        console.log('=>Error:', 'No Data');
        return;
      }
      _sign_in_api(data);
    });
  }

  async function _sign_in_api(googleData) {
    setLoading(true);
    const apiParams = {
      loginSource: 'google',
      sid: googleData.user.id,
      name: googleData.user.name,
      email: googleData.user.email,
      profileImage: googleData.user.photo,
      fcmToken: 'fcm_110220',
    };
    const {data, status} = await axiosClient.post(SIGN_IN, apiParams);
    setLoading(false);
    console.log(data);
    if (status == 200) {
      if (data.status === '200') {
        console.log('=> Success: ', data);
        toastMessage('success', data.message);
        _storeIntoAsyncStorage('user', JSON.stringify(data));
        navigation.navigate('SideNavigation');
      } else {
        toastMessage('error', data.message);
      }
    } else {
      toastMessage('error', 'Error in Sign In API');
    }
  }

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'#fffdee'} />
      <AppLoaderSpinner visible={loading} />
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
            textAlign: 'center',
            fontSize: 30,
            color: 'black',
            fontWeight: 'bold',
          }}>
          Hello
        </Text>
        <Text
          style={{
            textAlign: 'center',
          }}>
          Wlecome to our Ecommerce App
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'center',
          }}>
          <View style={{marginRight: 5}}>
            <RoundButtonComp label={'login'} width={120} />
          </View>
          <RoundButtonComp
            label={'Sign Up'}
            border={true}
            width={120}
            onPress={() => navigation.navigate('SignUpScreen')}
          />
        </View>

        <View
          style={{
            flex: 1,
            marginTop: 20,
            paddingBottom: 20,
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}>
            Or via social media account
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}>
            <FullRoundButtonComp
              image={require('../../assets/google.png')}
              bg={'#e54545'}
              onPress={() => googleSignIn()}
            />
            <FullRoundButtonComp
              image={require('../../assets/facebook.png')}
              bg={'#2d75e8'}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
