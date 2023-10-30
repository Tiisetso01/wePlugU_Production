import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import Swiper from 'react-native-swiper'
import { CDNURL_IMAGES } from '../utils/globalFunctions'

const SupabaseImageSwiper = ({image_path}) => {
    
  return (
    <View style ={styles.swiperContainer}>
        <Swiper showsButtons={true}  style={styles.imageSwiper}>
            {image_path.map((image, index)=>(
                <View style={{alignSelf:'center'}} key={index.toString()}>
                    <Image source={{uri: CDNURL_IMAGES + image}} style={styles.images} />
                </View>
            ))}
        </Swiper>
    </View>
  )
}

export default SupabaseImageSwiper

const styles = StyleSheet.create({
    swiperContainer:{
        marginVertical:10,
        height: 350,
      },
      images:{
        width: 350,
        height: 350,
        resizeMode: 'stretch',
      },
})