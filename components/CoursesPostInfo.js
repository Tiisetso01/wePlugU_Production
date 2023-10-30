import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CoursesPostInfo = ({postObj}) => {
  return (
    <View>
        <Text style={styles.label}>Category</Text>
        <Text style = {styles.info}>{postObj.category}</Text>

        <Text style={styles.label}>Institutions</Text>
        <Text style = {styles.info}>{postObj.institution}</Text>

        <Text style={styles.label}>Department</Text>
        <Text style = {styles.info}>{postObj.department}</Text>
        
        <Text style={styles.label}>Course (code)</Text>
        <Text style = {styles.info}>{postObj.course_code}</Text>

        <Text style={styles.label}>Product or Service Title</Text>
        <Text style = {styles.info}>{postObj.title}</Text>
    
        <Text style={styles.label}>Price</Text>
        <Text style = {styles.info}>{postObj.price}</Text>

    
        <Text style={styles.label}>Description</Text>
        <Text style = {styles.info}>{postObj.description}</Text>
    </View>
  )
}

export default CoursesPostInfo

const styles = StyleSheet.create({
  label:{ 
      marginBottom:3,
      fontWeight: "500",
      color: '#3399ff',
      fontSize: 18,
    },
    info:{
      width: '100%',
      backgroundColor: '#D1D1D1',
      borderRadius: 8,
      padding: 5,
      marginBottom: 10,
      fontWeight: '700'
    },
})