import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PromoFieldsInfo = ({fullName, institution, referral_code, status,amount, created_at}) => {
  return (
    <View>
      {/**Show this section if fullName || institution || referral_code */}
      {/** Because is information is not shown to the user is ShowUserPromoHistory screen */}
      {fullName && 
      <View>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{fullName}</Text>

        <Text style={styles.label}>Institution:</Text>
        <Text style={styles.value}>{institution}</Text>

        <Text style={styles.label}>Referral Code:</Text>
        <Text style={styles.value}>{referral_code}</Text>
      </View>
      }

        <Text style={styles.label}>Status: </Text>
        <Text style={styles.value}>{status}</Text>

        <Text style={styles.label}>Amount: </Text>
        <Text style={styles.value}>R{amount}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{(new Date(created_at)).toUTCString()}</Text>
    </View>
  )
}

export default PromoFieldsInfo

const styles = StyleSheet.create({
    label:{ 
        fontWeight: "500",
        color: '#3399ff',
        fontSize: 18,
    },
    value:{
      marginBottom: 8,
      fontWeight: "bold",
    },
})