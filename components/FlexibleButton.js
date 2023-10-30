import { StyleSheet, Text} from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const FlexibleButton = ({title, color, onPress}) => {
  return (
    <TouchableOpacity
        style={[styles.buttonContainer, {backgroundColor:color}]}
        onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default FlexibleButton

const styles = StyleSheet.create({
    buttonContainer:{
        //width:"100%",
        display:"flex",
        //alignItems:"center",
        backgroundColor:"red",
        alignSelf:"center",
        //justifyContent:"center",
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:5,
        elevation:2,
        shadowColor:"#000",
        shadowOffset:{
            width:2,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius: 3.5
    },
    buttonText:{
        color:"#fff",
        fontWeight:"bold",
        fontSize:16
    }
})