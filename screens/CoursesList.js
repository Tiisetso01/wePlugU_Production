import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase';

const CoursesList = ({navigation, route}) => {
    
    const {departmentData, departmentName} = route.params;
    const [courseCodes, setCoursesCodes] = useState([]);

    const handleOnPress = async(courseCode)=>{
        const courseMaterial = departmentData.filter((item)=>{ 
            return item.course_code == courseCode
        })
        
        navigation.navigate("CourseContent", {courseMaterial})
    }
    const fecthCoursesCodes = async()=>{
        const {data, error} = await supabase.from('Courses')
        .select("course_code")
        .eq("department", departmentName)
        if(!error) setCoursesCodes(data)
        
    }
    useEffect(()=>{
        fecthCoursesCodes()
    },[])
  return (
    <View style={styles. container}>
        <FlatList
            data={courseCodes}
            keyExtractor={(item)=> item.course_code}
            renderItem={({item})=>(
                <TouchableOpacity onPress={()=>handleOnPress(item.course_code)} style={styles.cartContainer}>
                    <Text style={styles.Text}>{item.course_code}</Text>
                </TouchableOpacity>
            )}
        />
    </View>
  )
}

export default CoursesList

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#DCDCDC',
        paddingHorizontal: 10
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