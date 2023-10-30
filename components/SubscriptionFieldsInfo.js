import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'

const SubscriptionFieldsInfo = ({purchaseDate, expirationDate, price, type}) => {
  return (
    <View>

      <Text style={styles.label}>Purchased Date:</Text>
      <Text style={styles.value}>{(new Date(purchaseDate)).toUTCString()}</Text>
      { 
        new Date(expirationDate) != new Date(purchaseDate) &&
        <View>
          <Text style={styles.label}>Expiration Date:</Text>
          <Text style={styles.value}>{(new Date(expirationDate)).toUTCString()}</Text>

          <Text style={styles.label}>Subscription Status: </Text>
          <Text style={styles.value}>{new Date() < new Date(expirationDate) ? "Active" : "Expired"}</Text>

        </View>
      }
      
      <Text style={styles.label}>Price:</Text>
      <Text style={styles.value}>{price}</Text>
    
  
      <Text style={styles.label}>Subscriptions Category:</Text>
      <Text style={styles.value}>{type}</Text>

        

       
    </View>
  )
}

export default memo(SubscriptionFieldsInfo)

const styles = StyleSheet.create({
    label:{ 
        fontWeight: "500",
        color: '#3399ff',
        fontSize: 16,
    },
    value:{
      marginBottom: 8,
      fontWeight: "bold",
    },
})