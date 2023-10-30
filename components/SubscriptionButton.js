import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const SubscriptionButton = ({title, onPress}) => {
  return (
    <TouchableOpacity
        style={styles.plansBtn} 
        onPress={onPress}
    >
        <Text style={styles.plansText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default SubscriptionButton

const styles = StyleSheet.create({
    plansBtn:{
        alignSelf:"center",
        backgroundColor:"#E5962D",
        marginBottom: 20,
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:30,
        elevation:3
     },
     plansText:{
        fontWeight:"bold",
        color:"#fff",
        fontSize:17
     }
})