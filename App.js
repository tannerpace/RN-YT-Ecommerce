import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import SplashScreen from './src/screens/splash';
import SiginInScreen from './src/screens/signin';
import SignUpScreen from './src/screens/SignUp';
import SideNavigation from './src/screens/SideNavigation';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import OnBoardingScreen from './src/screens/Onboarding';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Alert} from 'react-native';

const stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    pushNotification();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM message arrived 101!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'App Open By Clicking Notification',
        remoteMessage.notification,
      );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
        }
      });

    return unsubscribe;
  }, []);

  async function pushNotification() {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('token', fcmToken);
    }
  }

  return (
    <>
      <NavigationContainer>
        <stack.Navigator>
          <stack.Screen
            name={'OnBoardingScreen'}
            component={OnBoardingScreen}
            options={{headerShown: false}}
          />
          <stack.Screen
            name={'Splash'}
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <stack.Screen
            name={'SiginIn'}
            component={SiginInScreen}
            options={{headerShown: false}}
          />
          <stack.Screen
            name={'SignUpScreen'}
            component={SignUpScreen}
            options={{headerShown: false}}
          />
          <stack.Screen
            name={'SideNavigation'}
            component={SideNavigation}
            options={{headerShown: false}}
          />
        </stack.Navigator>
      </NavigationContainer>
      <Toast position="top" topOffset={50} visibilityTime={2000} />
    </>
  );
};

export default App;
