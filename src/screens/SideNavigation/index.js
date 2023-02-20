import React from 'react';
import {View, Text} from 'react-native';
import WelcomeScreen from '../welcome';
import MyShopScreen from '../MyShop/MyShopScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function SideNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName="WelcomeScreen"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: 'black',
        drawerActiveBackgroundColor: 'white',
        drawerInactiveTintColor: 'white',
      }}>
      <Drawer.Screen
        name="Nearby Shops"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="My Shop"
        component={MyShopScreen}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
