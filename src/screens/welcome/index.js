import {
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppToolBar from '../../components/AppToolBar';
import RoundButtonComp from '../../components/RoundButtonComp';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_API_KEY} from '../../config/LocalAppData';
import {GET_NEARBY_SHOPS, axiosClient} from '../../config/api';
import {_getFromAsyncStorage} from '../../config/asyncStorage';
import AppLoaderSpinner from '../../config/AppLoader';
import {toastMessage} from '../../config/AppTost';
import {add} from 'react-native-reanimated';
import {COLOR} from '../../config/Colors';

export default function WelcomeScreen({navigation}) {
  const [user, setUser] = useState();
  const [PGranted, setPGranted] = useState();
  const [shopList, setShopList] = useState([]);
  const [loading, setLoading] = useState(false);
  Geocoder.init(GOOGLE_API_KEY);

  useEffect(() => {
    checkLocationPermission();
    getUserData();
  }, []);

  async function getUserData() {
    const userData = await _getFromAsyncStorage('user');
    if (userData) {
      let userJson = JSON.parse(userData);
      setUser(userJson);
    }
  }

  async function checkLocationPermission() {
    let granted = await getLocationPermission();
    setPGranted(granted);
    console.log(granted);
    if (granted) {
      getCurrentLocation();
    }
  }

  async function getLocationPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).catch(err => {
      console.log(err);
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function getCurrentLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        Geocoder.from(location.latitude, location.longitude).then(data => {
          let fetchedAddress = data.results[0].formatted_address;
          if (shopList.length == 0) {
            getNearByShops(fetchedAddress);
          }
        });
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }

  async function getNearByShops(address) {
    setLoading(true);
    const queryString = require('query-string');
    const params = queryString.stringify({
      email: user.user.email,
      apiToken: user.user.token,
      address: address,
    });

    console.log(params, '=> Params');
    const {data, status} = await axiosClient.post(GET_NEARBY_SHOPS, params);
    setLoading(false);
    if (status == 200) {
      if (data.status === '200') {
        setShopList(data.data);
        toastMessage('success', data.message);
      } else {
        toastMessage('error', data.message);
      }
    } else {
      toastMessage('error', 'Error in Get NearBy Shop API');
    }
  }

  const Shop = ({item}) => {
    return (
      <View
        style={{
          margin: 5,
          elevation: 3,
          padding: 5,
          backgroundColor: '#F2F4F4',
          borderRadius: 5,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.3}}>
            <Image
              style={{
                width: '100%',
                height: 100,
                resizeMode: 'cover',
                borderRadius: 10,
              }}
              source={{uri: item.shopImage}}
            />
          </View>
          <View style={{flex: 0.7, paddingHorizontal: 10}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
              {item.name}
            </Text>
            <Text style={{}}>{item.address.toString().slice(0, 50)}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  Open Time
                </Text>
                <Text style={{}}>{item.timeOpen}</Text>
              </View>
              <View>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  Close Time
                </Text>
                <Text style={{}}>{item.timeClose}</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopColor: COLOR.BGray,
            borderTopWidth: 1,
            marginTop: 10,
          }}>
          <TouchableOpacity>
            <Text style={{color: COLOR.blue, fontWeight: 'bold'}}>
              More Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'#2E86C1'} />
      <AppToolBar navigation={navigation} label={'Nearby Stores'} />
      <AppLoaderSpinner visible={loading} />
      {PGranted !== undefined ? (
        PGranted ? (
          <View style={{flex: 1}}>
            {shopList.length > 0 ? (
              <FlatList
                data={shopList}
                keyExtractor={list => list.id.toString()}
                renderItem={({item}) => <Shop item={item} />}
              />
            ) : null}
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', paddingHorizontal: 15}}>
            <View
              style={{backgroundColor: '#F2F4F4', padding: 10, elevation: 2}}>
              <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
                Location Permission Required
              </Text>
              <Text style={{marginTop: 5}}>
                Please Allow Location Permission to Continue...
              </Text>
              <RoundButtonComp
                label={'Allow'}
                marginTop={20}
                onPress={() => checkLocationPermission()}
              />
            </View>
          </View>
        )
      ) : null}
    </View>
  );
}
