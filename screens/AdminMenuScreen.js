import { StyleSheet, Text, ScrollView ,View ,TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Icon } from 'react-native-elements'
import CategoryCourses from '../components/CategoryCourses'


const AdminMenuScreen = ({navigation}) => {
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Admin Menu",
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: "#61dafb",},
            headerLeft: ()=>(
                <TouchableNativeFeedback onPress={()=>navigation.openDrawer()}>
                    <Icon name='menu' type='material-icons' size={30}/>
                </TouchableNativeFeedback>
            )
        })
    },[])
    const categories = [
        
        [
            {text:"Add Departments", screen: "AddDepartments" },
            {text:"Manage Departments", screen: "ManageDepartments" }
        ],
        [
            {text:"Add Courses", screen: "AddCourses" },
            {text:"Manage Courses", screen: "ManageCourses" }
        ],
        [
            {text:"Post Assignments", screen: "UploadAssignments" },
            {text:"Manage Assignments", screen: "ManageAssignments" }
        ],
        [
            {text:"Post Past Papers", screen: "UploadPastPapers" },
            {text:"Manage Past Papers", screen: "ManagePastPapers" }
        ],
    ]
  return (
    <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.category} >
            <TouchableOpacity onPress={()=>navigation.navigate("ManagePromotions")} style={styles.item}>
                <Text style={styles.Text}>Manage Promotions</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.category} >
            <TouchableOpacity onPress={()=>navigation.navigate("ManageReports")} style={styles.item}>
                <Text style={styles.Text}>Manage Reports</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.category} >
            <TouchableOpacity onPress={()=>navigation.navigate("ManageTutoringRequestsTopTabs")} style={styles.item}>
                <Text style={styles.Text}>Manage Tutoring Requests</Text>
            </TouchableOpacity>
        </View>

        {
            categories.map((itemArr, index)=>(
                
                <CategoryCourses itemArr={itemArr} key={index.toString()}/>
                
            ))
        }
     
    </ScrollView>
  )
}

export default AdminMenuScreen

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    backgroundColor: '#DCDCDC',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent:'center'
},
category:{
    width: "99%",
    borderWidth: 1,
    borderTopEndRadius: 15,
    borderBottomStartRadius:15,
    marginVertical: 5,
    padding: 5,
},
item:{
    width: "99%",
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
},
Text:{
    fontWeight: 'bold'
}
})