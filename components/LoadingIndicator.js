import { View,Image, Text } from 'react-native'
import React from 'react'


const LoadingIndicator = ({message}) => {
  return (
    <View style={{flex:1, alignItems: 'center', justifyContent:'center', backgroundColor:"rgba(0,0,0,0.1)"}}> 
        <Image
            style ={{width: 80, height: 80,}}
            source={require("../assets/loading/Spinner-1s-200px.gif")}
        />
        {message != undefined && <Text style={{marginTop:20, fontSize:16, fontWeight:"bold"}}>{message}</Text>}
      </View>
  )
}

export default LoadingIndicator
