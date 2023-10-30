import { FlatList, TouchableOpacity , StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';
import DualBallLoading from '../components/DualBallLoading';
import SubscriptionButton from '../components/SubscriptionButton';

const CourseCategoryScreen = ({navigation}) => {
    const [departments, setDepartments] = useState([])
    const [courseCodes, setCourseCodes] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fecthDepartmentsCourses = async (department)=>{
        
        const {data,error} = await supabase.from("Documents")
        .select("*, Users(firstName, lastName)")
        .order("created_at", {ascending:false})
        .eq("department", department)
        if(!error) return data
        return []
    }


    const handleOnPress = async(department)=>{
        const departmentData = await fecthDepartmentsCourses(department);
        navigation.navigate("CoursesList", {departmentData, departmentName: department})
    }

    const fecthDepartments = async()=>{
        const {data, error} = await supabase.from('Departments')
        .select("department")
        .order("department", {ascending:true})

        if(!error) return setDepartments(data)
        
    }

    const fecthCourses = async()=>{
        const {data, error} = await supabase.from('Courses')
        .select("course_code")
        .order("course_code", {ascending:true})
        if(!error) {
            let coursesToRender = data.map((item)=>{
                return {key:item.course_code, value:item.course_code}
            })
            setCourseCodes(coursesToRender)
        }
    }
    useEffect(()=>{

        fecthDepartments()
        fecthCourses()
        setIsLoading(false)
    },[])

    if(isLoading) return <DualBallLoading />
     return (
        <View style={{flex:1, backgroundColor:"#DCDCDC", paddingTop:15}}>

           <SubscriptionButton
                title="See Tutoring Price Plans"
                onPress={()=> navigation.navigate("GeneralTutoringRequest", {courseCodes})}
            />
            <FlatList
                contentContainerStyle={styles.container}
                data={departments}
                keyExtractor={(item)=> item.department}
                numColumns={2}
                renderItem={({item})=>(
                    <TouchableOpacity onPress={()=>handleOnPress(item.department)} style={styles.cartContainer}>
                        <Text style={styles.Text}>{item.department}</Text>
                    </TouchableOpacity>
                )}
                
            />
        </View>
        
  
  )
}

export default CourseCategoryScreen

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        backgroundColor: '#DCDCDC',
        display: 'flex',
        alignItems:'center'
    },
    cartContainer:{
        width: 160,
        height: 100,
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