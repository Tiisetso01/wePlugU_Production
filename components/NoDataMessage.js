import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NoDataMessage = ({message}) => {
  return (
    <View style={styles.container}>
         <Text style={styles.Text}>{message}</Text>
    </View>
  )
}

export default NoDataMessage

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      Text:{
        fontSize: 17,
        fontWeight:'bold'
      },
})