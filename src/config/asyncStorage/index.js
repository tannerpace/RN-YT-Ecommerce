import AsyncStorage from '@react-native-async-storage/async-storage';

export const _storeIntoAsyncStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log('=> error: ', 'stroing data in asyn storage');
  }
};

export const _getFromAsyncStorage = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return value;
    } else {
      return null;
    }
  } catch (e) {
    console.log('=> error: ', 'getting data in asyn storage');
    return null;
  }
};
