import { Keyboard, StyleSheet, Text,TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import SmallButton from '../components/SmallButton';
import { supabase } from '../supabase/supabase';
import { showToast } from '../utils/globalFunctions';

const AddDepartments = () => {
    const [department, setDepartment] = useState("");
    const handleSubmit = async()=>{

        if(department == "") return showToast("All Fields are required.","red")
        const {error} = await supabase.from('Departments')
        .insert({
            department: department.trim(),
        })

        if(!error) return showToast("Data Updated Successfully", "green")
        showToast("Internal error occurred", "red")
    }

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
        
            <Text style={styles.label}>Add Department</Text>
            <TextInput
                style = {styles.input} 
                value = {department}
                autoCapitalize ='characters'
                placeholder = 'e.g Computer Science'
                onChangeText={ value =>{setDepartment(value)} }
            />
        
            <SmallButton title="Submit" color="#05c46b" onPress={()=>handleSubmit()}/>
    </View>
    </TouchableWithoutFeedback>
 
  )
}

export default AddDepartments

const styles = StyleSheet.create({
    container:{
        flex:1,
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