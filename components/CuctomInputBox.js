import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CuctomInputBox = () => {
  return (
    <View>
      <Text>CuctomInputBox</Text>
    </View>
  )
}

export default CuctomInputBox

const styles = StyleSheet.create({
    inputView:{
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        backgroundColor: '#f1f3f6',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input:{
        flex:1,
        
    },
})