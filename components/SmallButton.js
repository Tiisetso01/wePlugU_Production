import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'

const SmallButton = ({title, color, onPress}) => {
  return (
    <TouchableOpacity style={[styles.smallButton, {backgroundColor:color}]} onPress ={onPress}>
          <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default SmallButton

const styles = StyleSheet.create({
    smallButton:{
        width:150,
        height:40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:5,
        shadowColor: '#000',
        shadowOffset:{
            width:3,
            height:3,
        },
        shadowOpacity:0.5,
        
    },
    btnText:{
        fontSize: 16,
        fontWeight:'bold',
        color: '#fff'
    }
})