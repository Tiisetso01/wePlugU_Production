import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabase';
import SmallButton from '../components/SmallButton'
import DualBallLoading from '../components/DualBallLoading';
import { showToast } from '../utils/globalFunctions';
import { realTimeData } from '../utils/supabaseGlobalFunctions';

const ManageDepartments = () => {
    const [departments, setDepartments] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getDepartments = async()=>{
        const {data, error} = await supabase.from("Departments")
        .select("*")

        if(!error) setDepartments(data)
        setIsLoading(false)
    }

    const deleteDepartment = async(id)=>{
        const {error} = await supabase.from("Departments")
        .delete()
        .eq("id", id)
        if(!error) showToast("Deleted SuccessFully", "green")
    }
    
    useEffect(()=>{
        getDepartments();
    },[])
    useEffect(()=>{ realTimeData(getDepartments, "Departments")},[])
  
  if(isLoading) return <DualBallLoading />
  return (
    <ScrollView contentContainerStyle={styles.container}>
        { departments.length > 0 
            ? departments.map((item, index)=>(
                <View style={styles.cart} key={index.toString()}>
                    <Text style={styles.text}>{item.department}</Text>
                    <SmallButton 
                        title="Delete" 
                        color="red" 
                        onPress={()=>{
                            Alert.alert(
                                "Delete Department?",
                                "Are you sure you want to delete this department?",
                                [
                                {
                                    text: 'Cancel',
                                    onPress: () => null,
                                },
                                {
                                    text: 'Yes',
                                    onPress: async() => { await deleteDepartment(item.id)},
                                },
                                ],
                                
                            )
                        }}
                    /> 
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

export default ManageDepartments

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor:'#DCDCDC'
    },
    cart:{
        margin:5,
        padding: 5,
        width:"99%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor:'#fff',
        borderRadius:10
    },
    text:{
        fontWeight:"600"
    }
    ,
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