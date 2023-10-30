import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PostInfo = ({postObj}) => {
  return (
    <View>
        <Text style={styles.label}>Category</Text>
        <View style={styles.infoView}><Text style = {styles.info}>{postObj.category}</Text></View>
        
        
        <Text style={styles.label}>Product or Service Title</Text>
        <View style={styles.infoView}><Text style = {styles.info}>{postObj.title}</Text></View>
        
        
        <Text style={styles.label}>Location</Text>
        <View style={styles.infoView}><Text style = {styles.info}>{postObj.location}</Text></View>
        

        <Text style={styles.label}>Price</Text>
        <View style={styles.infoView}><Text style = {styles.info}>{postObj.price}</Text></View>
        


        <Text style={styles.label}>Description</Text>
        <View style={styles.infoView}><Text style = {styles.info}>{postObj.description}</Text></View>
        
    </View>
  )
}

export default PostInfo

const styles = StyleSheet.create({
    label:{ 
        marginBottom:3,
        fontWeight: "500",
        color: '#3399ff',
        fontSize: 18,
      },
      infoView:{
        width: '100%',
        backgroundColor: '#D1D1D1',
        paddingHorizontal: 5,
        paddingVertical:2,
        marginBottom: 10,
        borderRadius: 8,
      },
      info:{
        fontSize:16,
      }
    
})