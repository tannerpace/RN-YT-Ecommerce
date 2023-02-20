import {
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {OnBoardingData} from '../../config/LocalAppData';

export default function OnBoardingScreen() {
  const scrollx = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);
  const {width, height} = Dimensions.get('screen');

  const onViewableItemsChanged = info => {
    console.log(info);
    setCurrentIndex(info.viewableItems[0].index);
  };

  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

  const OnBoardingItem = ({item}) => {
    return (
      <View
        style={{
          width,
          height,
          backgroundColor: item.color,
          justifyContent: 'center',
          padding: 20,
        }}>
        <Image
          source={item.image}
          style={{width: '100%', flex: 0.5, resizeMode: 'contain'}}
        />
        <Text style={{fontSize: 20, fontWeight: '800', color: 'black'}}>
          {item.heading}
        </Text>
        <Text>{item.subHeading}</Text>
      </View>
    );
  };

  const Indicator = ({scrollx}) => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 60,
          flexDirection: 'row',
        }}>
        {OnBoardingData.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const scale = scrollx.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });
          const opacity = scrollx.interpolate({
            inputRange,
            outputRange: [0.6, 0.9, 0.8],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`ind=${i}`}
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: '#333',
                margin: 10,
                transform: [{scale}],
                opacity,
              }}
            />
          );
        })}
      </View>
    );
  };

  function scrollTo() {
    if (currentIndex < OnBoardingData.length - 1) {
      slideRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      console.log('LAST PAGE');
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Animated.FlatList
        ref={slideRef}
        data={OnBoardingData}
        keyExtractor={item => item.id}
        renderItem={({item}) => <OnBoardingItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollx}}}],
          {useNativeDriver: false},
        )}
        bounces={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <Indicator scrollx={scrollx} />
      <View
        style={{
          position: 'absolute',
          bottom: 10,
        }}>
        <TouchableOpacity onPress={() => scrollTo()}>
          <Text
            style={{
              backgroundColor: 'black',
              color: 'white',
              paddingHorizontal: 25,
              paddingVertical: 5,
              borderRadius: 15,
            }}>
            {currentIndex == OnBoardingData.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
