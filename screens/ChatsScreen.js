import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'

const ChatsScreen = () => {
  return (
    <SafeAreaView style ={styles.container}>
      <Text>ChatsScreen</Text>
    </SafeAreaView>
  )
}

export default ChatsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
