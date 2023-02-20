import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_API_KEY} from '../config/LocalAppData';
import {COLOR} from '../config/Colors';

export default function LocationPickerModal({
  visible,
  onclose,
  onLocationSelected,
}) {
  const mapRef = useRef();
  const [marker, setMarker] = useState();
  const [address, setAddress] = useState();
  Geocoder.init(GOOGLE_API_KEY);

  useEffect(() => {
    if (marker !== undefined) {
      Geocoder.from(marker.latitude, marker.longitude).then(data => {
        let fetchedAddress = data.results[0].formatted_address;
        setAddress(fetchedAddress);
      });
    }
  }, [marker]);

  return (
    <Modal visible={visible}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <MapView
          ref={mapRef}
          zoomControlEnabled={true}
          showsMyLocationButton={true}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: 24.85857,
            longitude: 67.085794,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          onPress={e => setMarker(e.nativeEvent.coordinate)}>
          {marker !== undefined ? <Marker coordinate={marker} /> : null}
        </MapView>
        <View
          style={{
            padding: 15,
            backgroundColor: 'white',
            marginVertical: 10,
            marginHorizontal: 10,
            borderRadius: 10,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 18}}>
                Pick Shop Location
              </Text>

              <TouchableOpacity onPress={() => onclose()}>
                <AntDesign name="closecircle" color={'black'} size={20} />
              </TouchableOpacity>
            </View>
            <Text style={{marginTop: 10, paddingRight: 15}}>{address}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            onLocationSelected({
              marker,
              address,
            })
          }
          style={{
            position: 'absolute',
            bottom: 5,
            left: Dimensions.get('window').width / 2 - 70,
          }}>
          <View
            style={{
              bottom: 5,
              backgroundColor: COLOR.blue,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Confirm Location
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
