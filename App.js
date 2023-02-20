import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SplashScreen from './src/screens/splash';
import SiginInScreen from './src/screens/signin';
import SignUpScreen from './src/screens/SignUp';
import SideNavigation from './src/screens/SideNavigation';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import OnBoardingScreen from './src/screens/Onboarding';

const stack = createNativeStackNavigator();

const App = () => {
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
