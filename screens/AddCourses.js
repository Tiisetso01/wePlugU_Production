import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text,TextInput, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import SmallButton from '../components/SmallButton';
import { supabase } from '../supabase/supabase';
import { SelectList } from 'react-native-dropdown-select-list';
import { fetchInstitutions, showToast } from '../utils/globalFunctions';

const AddCourses = () => {
    const [department, setDepartment] = useState("");
    const [course, setCourse] = useState("");
    const [institution, setInstitution] = useState("");
    const [allInstitutions, setAllInstitutions] = useState("");
    const [departmentData, setDepartmentData] = useState("");

    const handleSubmit = async()=>{

        if(department == "" || course == "" || institution == "") return showToast("All Fields are required.","red")
        const {error} = await supabase.from('Courses')
        .insert({
            institution,
            department,
            course_code: course.trim()
        })
        if(!error) return showToast("Data Updated Successfully", "green")
        showToast("Internal error occurred", "red")
        
    }
    

    const fecthDepartments = async()=>{


        const {data, error} = await supabase.from("Departments")
        .select("department")

        if(!error){
            let tempArr = data.map((item, index)=>{return{key:`${index}`, value: item.department} })
            setDepartmentData(tempArr)
        }
    }


    const getInstitutions = async()=>{
        setAllInstitutions(await fetchInstitutions())
    }
      
    useEffect(()=>{
        getInstitutions()
        fecthDepartments()
        
    },[])
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS = "ios" ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.label}>Select Instutition</Text>
                <SelectList
                    boxStyles={{marginBottom:15, width: Dimensions.get('window').width * 0.8}}
                    setSelected={(val) => setInstitution(val)} 
                    data={allInstitutions}
                    save="value"
                />
                <Text style={styles.label}>Select Department</Text>
                <SelectList 
                    boxStyles={{marginBottom:15, width: Dimensions.get('window').width * 0.8}}
                    setSelected={(val) => setDepartment(val)} 
                    data={departmentData}
                    save="value"
                />
                <Text style={styles.label}>Add Course</Text>
                <TextInput
                    style = {styles.input} 
                    value = {course}
                    autoCapitalize ='characters'
                    placeholder = 'e.g CSC2001F'
                    onChangeText={ value =>{setCourse(value)} }
                />
                
            
                <SmallButton title="Submit" color="#05c46b" onPress={()=>handleSubmit()}/>
            </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
 
  )
}

export default AddCourses

const styles = StyleSheet.create({
    container:{
        flexGrow:1,
        justifyContent:'center',
        alignItems:'center'
    },
    label:{
        marginBottom:3,
        fontWeight: "500",
        color: '#3399ff',
        fontSize: 18,
    },
    input:{
        height: 40,
        width: '80%',
        backgroundColor: '#eee',
        borderRadius: 8,
        borderWidth:1,
        paddingHorizontal: 10,
        marginBottom: 40,
    }
})