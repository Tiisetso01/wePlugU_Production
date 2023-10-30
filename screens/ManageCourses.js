import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabase';
import SmallButton from '../components/SmallButton'
import DualBallLoading from '../components/DualBallLoading';
import { showToast } from '../utils/globalFunctions';
import { realTimeData } from '../utils/supabaseGlobalFunctions';

const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getCourses = async()=>{
    const {data, error} = await supabase.from("Courses")
    .select("*")

    if(!error) setCourses(data)
    setIsLoading(false)
  }

  const deleteCourse = async(id)=>{
    const {error} = await supabase.from("Courses")
    .delete()
    .eq("id", id)
    if(!error) showToast("Deleted SuccessFully", "green")
  }
  
  useEffect(()=>{
    getCourses();
  },[])
  useEffect(()=>{ realTimeData(getCourses, "Courses")},[])

if(isLoading) return <DualBallLoading />

return (
  <ScrollView contentContainerStyle={styles.container}>
    { courses.length > 0 
        ? courses.map((item, index)=>(
            <View style={styles.cart} key={index.toString()}>
            <Text style={styles.label}>Institutions</Text>
            <Text style = {styles.info}>{item.institution}</Text>

            <Text style={styles.label}>Department</Text>
            <Text style = {styles.info}>{item.department}</Text>
            
            <Text style={styles.label}>Course (code)</Text>
            <Text style = {styles.info}>{item.course_code}</Text>
            <View style={{alignSelf:'flex-end'}}>
              <SmallButton 
                title="Delete"  
                color="red" 
                onPress={()=>{
                  Alert.alert(
                    "Delete Course?",
                    "Are you sure you want to delete this course?",
                    [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                    },
                    {
                      text: 'Yes',
                      onPress: async() => { await deleteCourse(item.id)},
                    },
                    ], 
                  )
                }}
              />
            </View> 
            </View>
          ))
        : 
        (
          <View style={styles.noPostcontainer}>
            <Text style={styles.noPostText}>Your Posts will appear here.</Text>
          </View>
        )
    }
  </ScrollView>
)
}

export default ManageCourses

const styles = StyleSheet.create({
  container:{
  flexGrow: 1,
  alignItems: 'center',
  backgroundColor:'#DCDCDC'
},
cart:{
  margin:5,
  padding: 5,
  width:"97%",
  backgroundColor:'#fff',
  borderRadius:10
},
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
noPostcontainer:{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
noPostText:{
  fontSize: 20,
  fontWeight:'bold'
},
})