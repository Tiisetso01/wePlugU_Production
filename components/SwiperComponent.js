import { StyleSheet,Image, View } from 'react-native'
import Swiper from 'react-native-swiper';
import React from 'react'


const SwiperComponent = ({images}) => {
  const defaultImage = require('../assets/images/image-placeholder.png')
  return (
    <View style ={styles.swiperContainer}>
        <Swiper showsButtons={true}  style={styles.imageSwiper}>
            
            { images.length > 0 
              ? 
                images.map((image, index)=>(
                  <View style={{alignSelf:'center'}} key={index.toString()}>
                      <Image source={{uri: image.uri}} style={styles.images} />
                  </View>
                ))
              :
              (
                <Image source={defaultImage} style={styles.images} />
              )
            }
            
        </Swiper>
    </View>
  )
}

export default SwiperComponent

const styles = StyleSheet.create({
  swiperContainer:{
      marginVertical:10,
      
    },
    imageSwiper:{
      backgroundColor: '#eee',
      height: 350,
    },
    images:{
      width: 350,
      height: 350,
      resizeMode: 'stretch',
    },
})