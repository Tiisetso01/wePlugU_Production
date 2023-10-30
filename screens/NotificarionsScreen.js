import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NotificarionsScreen = ({navigation}) => {
    var now = new Date(); 
    //const trigger = new Date(Date.now() + 60 * 60 * 1000);
    now.setDate(now.getDate() + 30);
  return (
    <ScrollView>
      <Text>NotificarionsScreen</Text>
    </ScrollView>
  )
}

export default NotificarionsScreen

const styles = StyleSheet.create({
  
})