import {Toast} from 'react-native-toast-message/lib/src/Toast';

export const toastMessage = (type, text) => {
  Toast.show({
    type,
    text1: text,
  });
};

export const hideToastMessage = () => {
  Toast.hide();
};
