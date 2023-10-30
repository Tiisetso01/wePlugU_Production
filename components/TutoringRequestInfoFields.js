import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useState } from 'react'

const TutoringRequestInfoFields = ({fullName, institution,price, phone, message,courseCode, fileObj, email, created_at}) => {
    const [showMore, setShowMore] = useState(false)
    let questionsFileName = "";
    if(fileObj){
        questionsFileName = fileObj.questionsFileName
    }

  return (
    <View>
     
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{fullName}</Text>

        <Text style={styles.label}>Institution:</Text>
        <Text style={styles.value}>{institution}</Text>

        <Text style={styles.label}>Contacts:</Text>
        <Text style={styles.value}>{email}</Text>
        <Text style={styles.value}>{phone}</Text>

        <Text style={styles.label}>Price Plan:</Text>
        <Text style={styles.value}>R {price}</Text>

        {
            courseCode !== "" &&
            ( <View>
                <Text style={styles.label}>Course Code:</Text>
                <Text style={styles.value}>{courseCode}</Text>
              </View>
            )
        }

        {
            questionsFileName !== "" &&
            ( <View>
                <Text style={styles.label}>Questions File Name:</Text>
                <Text style={styles.value}>{questionsFileName}</Text>
              </View>
            )
        }
       
        <Text style={styles.label}>Request Message:</Text>
        
            {
                message.length > 50
                    ? 
                        <View style={{fontSize:16, width:"100%", marginBottom: 8,}}>
                            <Text style={{marginTop:5}}>
                                {showMore ? message : message.slice(0, 50)}
                            </Text>
                            <Text onPress={()=>setShowMore(!showMore)} style={{fontWeight:"bold"}}>{showMore ? "show less": "show more"}</Text>
                        </View>
                    : 
                     <Text style={{marginBottom: 8,}}>{message}</Text>
            }

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{(new Date(created_at)).toUTCString()}</Text>
    </View>
  )
}

export default memo(TutoringRequestInfoFields)

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