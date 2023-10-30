import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useState } from 'react'

const ReportsFieldsInfo = ({fullName, institution, reportMessage, category, created_at}) => {
    const [showMore, setShowMore] = useState(false)
  return (
    <View>
     
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{fullName}</Text>

        <Text style={styles.label}>Institution:</Text>
        <Text style={styles.value}>{institution}</Text>

        <Text style={styles.label}>Report Category</Text>
        <Text style={styles.value}>{category}</Text>

        <Text style={styles.label}>Report Message</Text>
        
            {
                reportMessage.length > 50
                    ? 
                        <View style={{fontSize:16, width:"100%", marginBottom: 8,}}>
                            <Text style={{marginTop:5}}>
                                {showMore ? reportMessage : reportMessage.slice(0, 50)}
                            </Text>
                            <Text onPress={()=>setShowMore(!showMore)} style={{fontWeight:"bold"}}>{showMore ? "show less": "show more"}</Text>
                        </View>
                    : 
                     <Text style={{marginBottom: 8,}}>{reportMessage}</Text>
            }

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{(new Date(created_at)).toUTCString()}</Text>
    </View>
  )
}

export default memo(ReportsFieldsInfo)

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