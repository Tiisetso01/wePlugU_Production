import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const LargeButton = ({color, title, onPress}) => {
  return (
    <TouchableOpacity
        style={[styles.buttonContainer, {backgroundColor:color}]}
        onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default LargeButton

const styles = StyleSheet.create({
    buttonContainer:{
        width:"100%",
        display:"flex",
        alignItems:"center",
        backgroundColor:"red",
        alignSelf:"center",
        paddingVertical:10,
        borderRadius:10,
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
        fontSize:20
    }
})