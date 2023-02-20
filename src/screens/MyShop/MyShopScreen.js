import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AppToolBar from '../../components/AppToolBar';
import {_getFromAsyncStorage} from '../../config/asyncStorage';
import SelectionComp from '../../components/SelectionComp';
import FormInputText from '../../components/FormInputText';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {launchImageLibrary} from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {CategoryLS} from '../../config/LocalAppData';
import LocationPickerModal from '../../modals/LocationPickerModal';
import DatePicker from 'react-native-date-picker';
import {formatTime} from '../../config/datePicker';
import {toastMessage} from '../../config/AppTost';
import {axiosClient, CREATE_SHOP} from '../../config/api';
import RoundButtonComp from '../../components/RoundButtonComp';
import {_storeIntoAsyncStorage} from '../../config/asyncStorage';
import AppLoaderSpinner from '../../config/AppLoader';

export default function MyShopScreen({navigation}) {
  const refRBSheet = useRef();
  const [loading, setLoading] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState();
  const [currentTimeOption, setCurrentTimeOption] = useState();
  const [user, setUser] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [showGMap, setShowGMap] = useState(false);
  const [shopImage, setShopImage] = useState();
  const [shopOwnerImage, setShopOwnerImage] = useState();
  const [shopCategory, setShopCategory] = useState();
  const [shopLocation, setShopLocation] = useState();
  const [shopOpenTime, setShopOpenTime] = useState();
  const [shopCloseTime, setShopCloseTime] = useState();

  useEffect(() => {
    getUserData();
  }, []);

  async function createMyShop() {
    if (!name) {
      toastMessage('error', 'Please provide shop name');
      return;
    }
    if (!shopImage) {
      toastMessage('error', 'Please provide shop image');
      return;
    }
    if (!shopOwnerImage) {
      toastMessage('error', 'Please provide shop owner image');
      return;
    }
    if (!shopLocation) {
      toastMessage('error', 'Please provide shop location');
      return;
    }
    if (!shopOpenTime) {
      toastMessage('error', 'Please provide shop open time');
      return;
    }
    if (!shopCloseTime) {
      toastMessage('error', 'Please provide shop close time');
      return;
    }

    const formData = new FormData();
    formData.append('email', user.user.email);
    formData.append('apiToken', user.user.token);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('latitude', shopLocation.marker.latitude);
    formData.append('longitude', shopLocation.marker.longitude);
    formData.append('address', shopLocation.address);
    formData.append('category', shopCategory);
    formData.append('timeOpen', shopOpenTime);
    formData.append('timeClose', shopCloseTime);
    formData.append('shopImage', {
      uri: shopImage.assets[0].uri,
      type: shopImage.assets[0].type,
      name: shopImage.assets[0].fileName,
    });
    formData.append('shopKeeperImage', {
      uri: shopOwnerImage.assets[0].uri,
      type: shopOwnerImage.assets[0].type,
      name: shopOwnerImage.assets[0].fileName,
    });

    setLoading(true);
    const {data, status} = await axiosClient.post(CREATE_SHOP, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setLoading(false);
    if (status == 200) {
      if (data.status === '200') {
        console.log('=> Success Create Shop API', data);
        toastMessage('success', data.message);
        let updatedUserData = user;
        updatedUserData.shopData = data.data;
        _storeIntoAsyncStorage('user', JSON.stringify(updatedUserData));
      } else {
        toastMessage('error', data.message);
      }
    } else {
      toastMessage('error', '=> Error: Create Shop API');
    }
  }

  async function getUserData() {
    const userData = await _getFromAsyncStorage('user');
    if (userData) {
      let userJson = JSON.parse(userData);
      setUser(userJson);
    }
  }

  async function pickShopImageFromGallery() {
    const results = await launchImageLibrary();
    if (results.didCancel) {
      return;
    }
    setShopImage(results);
  }

  async function pickShopOwnerImageFromGallery() {
    const results = await launchImageLibrary();
    if (results.didCancel) {
      return;
    }
    setShopOwnerImage(results);
  }

  const SelectCategoryBS = () => {
    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Dimensions.get('window').height / 2}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View style={{padding: 15}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Select Shop Category
          </Text>
          <View>
            {CategoryLS.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setShopCategory(item.name);
                    refRBSheet.current.close();
                  }}>
                  <View style={{marginTop: 10}}>
                    <View
                      style={{
                        padding: 5,
                        borderBottomColor: '#D5D8DC',
                        borderBottomWidth: 1,
                      }}>
                      <Text style={{marginBottom: 5}}>{item.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </RBSheet>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AppLoaderSpinner visible={loading} />
      <AppToolBar label={'My Shop'} navigation={navigation} />
      <SelectCategoryBS />
      <LocationPickerModal
        visible={showGMap}
        onclose={() => setShowGMap(false)}
        onLocationSelected={data => {
          setShopLocation(data);
          setShowGMap(false);
        }}
      />
      <DatePicker
        modal
        mode="time"
        open={openDatePicker}
        date={new Date()}
        onConfirm={date => {
          setOpenDatePicker(false);
          if (currentTimeOption === 'open') {
            setShopOpenTime(
              formatTime(date.getHours() + ':' + date.getMinutes()),
            );
          } else if (currentTimeOption === 'close') {
            setShopCloseTime(
              formatTime(date.getHours() + ':' + date.getMinutes()),
            );
          }
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
      />
      {user == undefined ? null : user.shopData == null ? (
        <>
          <View style={{flex: 1, padding: 15}}>
            <FormInputText
              placeholder={'Name'}
              onChangeText={text => setName(text)}
            />
            <FormInputText
              placeholder={'Phone'}
              extraStyle={{marginTop: 10}}
              keyboardType={'number-pad'}
              onChangeText={text => setPhone(text)}
            />
            <SelectionComp
              label={'Upload Shop Image'}
              image={<Ionicons name="ios-image" size={25} />}
              extraStyle={{marginTop: 20}}
              checked={shopImage ? true : false}
              onPress={() => pickShopImageFromGallery()}
            />
            <SelectionComp
              label={'Upload Shop Owner Image'}
              image={<Ionicons name="ios-image" size={25} />}
              extraStyle={{marginTop: 10}}
              checked={shopOwnerImage ? true : false}
              onPress={() => pickShopOwnerImageFromGallery()}
            />
            <SelectionComp
              label={
                shopCategory === undefined
                  ? 'Select Category'
                  : 'Select Category - ' + shopCategory
              }
              image={<EvilIcons name="chevron-down" size={30} />}
              extraStyle={{marginTop: 10}}
              onPress={() => refRBSheet.current.open()}
            />
            <SelectionComp
              label={'Select Shop Location'}
              image={<MaterialIcons name="my-location" size={25} />}
              extraStyle={{marginTop: 10}}
              checked={shopLocation ? true : false}
              onPress={() => setShowGMap(true)}
            />
            <SelectionComp
              label={
                shopOpenTime === undefined
                  ? 'Open Time'
                  : 'Open Time - ' + shopOpenTime
              }
              checked={shopOpenTime ? true : false}
              image={<Ionicons name="time" size={25} />}
              extraStyle={{marginTop: 10}}
              onPress={() => {
                setCurrentTimeOption('open');
                setOpenDatePicker(true);
              }}
            />
            <SelectionComp
              label={
                shopOpenTime === undefined
                  ? 'Close Time'
                  : 'Close Time - ' + shopCloseTime
              }
              checked={shopCloseTime ? true : false}
              image={<Ionicons name="time" size={25} />}
              extraStyle={{marginTop: 10}}
              onPress={() => {
                setCurrentTimeOption('close');
                setOpenDatePicker(true);
              }}
            />
            <RoundButtonComp
              label={'Submit'}
              marginTop={20}
              onPress={() => createMyShop()}
            />
          </View>
        </>
      ) : (
        <>
          <View style={{flex: 1}}>
            <ImageBackground
              source={{uri: user.shopData.shopImage}}
              resizeMode={'cover'}
              style={{
                flex: 0.3,
                backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: 'yellow',
                  position: 'absolute',
                  bottom: -50,
                }}>
                <Image
                  style={{width: 100, height: 100, borderRadius: 50}}
                  source={{
                    uri: user.shopData.shopKeeperImage,
                  }}
                />
              </View>
            </ImageBackground>
            <View style={{flex: 0.7}}>
              <View style={{marginTop: 55, alignItems: 'center'}}>
                <Text
                  style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
                  {user.shopData.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#F2F4F4',
                  elevation: 3,
                  padding: 10,
                  marginTop: 20,
                  marginHorizontal: 10,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flex: 0.3,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    Total Orders
                  </Text>
                  <Text style={{fontWeight: '500', marginTop: 3}}>100</Text>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    Reviews
                  </Text>
                  <Text style={{fontWeight: '500', marginTop: 3}}>120</Text>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    Rating
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{fontWeight: '500', marginTop: 3, marginRight: 5}}>
                      4.5
                    </Text>
                    <AntDesign name="star" color={'#F1C40F'} />
                  </View>
                </View>
              </View>
              <View></View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
