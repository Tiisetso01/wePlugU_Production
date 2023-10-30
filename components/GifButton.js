import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'


const GifButton = ({title, onPress, iconName, requireGif,}) => {
  return (
    <TouchableOpacity 
        style={styles.downloadButton}
        onPress={onPress}
    >
        <Icon type='material-icons' name="attachment" size={25} color={'#46dff0'} />
        <Text style={styles.Text}>{title}</Text>
        {/*<Image source={require("../assets/FlatIcons/download.gif")} style={styles.image}/>*/}
    </TouchableOpacity>
  )
}

export default GifButton

const styles = StyleSheet.create({
    downloadButton:{
        flexDirection: 'row',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "#e90c59",
        paddingHorizontal:2,
        height:40,
        borderRadius:5,
        marginVertical:10,

      },
      image:{
        width:40,
        height:30
      },
      Text:{
        marginLeft:3,
        marginRight: 5,
        fontWeight: 'bold',
        color:'#eee',
        fontSize:14,
        textDecorationLine:"underline"
      },
})