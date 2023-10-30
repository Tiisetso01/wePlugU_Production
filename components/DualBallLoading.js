import { View,Image } from 'react-native'
import React from 'react'


const DualBallLoading = () => {
  return (
    <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}> 
        <Image
            style ={{width: 60, height: 60,}}
            source={require("../assets/loading/Dual-Ball-1s-200px.gif")}
        />
      </View>
  )
}

export default DualBallLoading
