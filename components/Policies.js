import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as Linking from 'expo-linking'
import { useNavigation } from '@react-navigation/native'


const Policies = () => {
   const navigation = useNavigation()
  return (
    <View>
      <Text style={{alignSelf:"center", fontSize:16}}>By subscribing you agree to our: </Text>
            <View style={{flexDirection:"row",justifyContent:"center" }}>
               <Text    
                  style={styles.links}
                  onPress={()=> Linking.openURL("https://tiisetso01.github.io/weplugu/")}
               >
                  privacy policy 
               </Text>
               <Text style={{ fontSize:16}}>  and  </Text>
               <Text
                  style={styles.links}
                  onPress={()=> navigation.navigate("subscriptionTerms")}
               >
                terms of use
               </Text>
            </View>
    </View>
  )
}

export default Policies

const styles = StyleSheet.create({
    links:{
        fontWeight:"bold",
        textDecorationLine:"underline",
        fontSize:16
     }
})