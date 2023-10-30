import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import React from 'react'


const CourseContent = ({navigation, route}) => {

  const {courseMaterial} = route.params;
  const handleOnPress = async(category)=>{
    const categoryMaterial = courseMaterial.filter((item)=>{ 
      
        return item.category == category
    })
   
    navigation.navigate(category, {categoryMaterial})
}
  return (
    <View style = {styles.container}>
      <TouchableOpacity onPress={()=>handleOnPress("Notes")} style={styles.cartContainer}>
          <Text style={styles.Text}>Well Structured Notes</Text>
      </TouchableOpacity>
      {
        courseMaterial.length > 0 && (courseMaterial[0].department).toUpperCase() == "COMPUTER SCIENCE" &&
        <TouchableOpacity onPress={()=>handleOnPress("Assignments")} style={styles.cartContainer}>
          <Text style={styles.Text}>Past Assignments Questions and Solutions</Text>
        </TouchableOpacity>
      }
      

    <TouchableOpacity onPress={()=>handleOnPress("PastPapers")} style={styles.cartContainer}>
        <Text style={styles.Text}>Past Tests/Exams Questions and Solutions</Text>
    </TouchableOpacity>
    </View>
  )
}

export default CourseContent

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#DCDCDC',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent:'center'
},
cartContainer:{
    width: "99%",
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 5,
},
Text:{
    fontWeight: 'bold'
}
})