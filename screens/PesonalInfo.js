import React, {useEffect, useState}from "react";
import {Text, View, 
 StyleSheet, TouchableOpacity, TouchableWithoutFeedback,ScrollView, TextInput,  Keyboard, Alert} from "react-native";
import {Button, Icon, Input} from 'react-native-elements';
import { SelectList } from 'react-native-dropdown-select-list';
import { supabase } from "../supabase/supabase";
import { Formik } from 'formik';
import * as Yup from "yup";
import { fecthInfo, fetchInstitutions, showToast } from "../utils/globalFunctions";
import DualBallLoading from "../components/DualBallLoading";
import { getUserPersonalInfo } from "../utils/supabaseGlobalFunctions";
import * as Linking from 'expo-linking';

const Personalnfo = () =>{

    const [allInstitutions, setAllInstitutions] = useState([]);
    const [defaultInstArr, setDefaultInstArr] = useState([])
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const updatePersonalInfo = async (values) => {
        
      const {error} = await supabase
      .from('Users')
      .update(values)
      .eq("user_id", userData.user_id)
      
      if(error){
        Alert.alert('Error Message', "Something went wrong while saving your data");
        return;
      }
      showToast("Data updated successfully.","green")
    };
    
    useEffect(()=>{
      const fetchUserData = async()=>{

        const user_id = (await fecthInfo()).id
        const user = await getUserPersonalInfo(user_id)
        setUserData(user)
          let institutionsObjArr = fetchInstitutions()
          let institutionsArr = institutionsObjArr.map((item) => {return item.value})
          setAllInstitutions(institutionsObjArr)
          setDefaultInstArr(institutionsArr)
          return setIsLoading(false)
        
      }
      fetchUserData()
    },[])

    useEffect(()=>{
      
    },[])
    
    const initialValues = {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phone:(userData?.phone)?.toString(),
      institution: userData?.institution,
    };  
    const validationSchema = Yup.object({

      firstName: Yup.string().min(3, "should be atleast 3 minimum of characters.")
      .required("First Name is required."),
      lastName: Yup.string().min(3, "Should be atleast 3 minimum of characters.")
      .required("Last Name is required."),
      phone: Yup.string().matches(/^[0-9]+$/,"Must be digits only").required("Phone number is required."),
      institution: Yup.string().required("Please select instutition."),
    });
  
  
    if(isLoading){
      return (<DualBallLoading />)
    }
   
    return(
    <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
            await updatePersonalInfo(values)
      }}
    >
    {({ values, errors, touched, handleChange,setFieldTouched,isValid, handleSubmit, isSubmitting, }) => (
      <ScrollView  contentContainerStyle ={styles.container}>

        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        
          <View style ={styles.centeredContainer}>
         
              <View style={styles.inputBox}>       
                <View style = {styles.inputLable}>
                  <Icon name="user" type="font-awesome" size={20}/>
                  <Text> First Name</Text>
                </View>
                <TextInput style = {styles.inputView}
                  value={values.firstName}
                  placeholder = 'First Name'
                  onChangeText={handleChange('firstName')}
                  onBlur={()=>setFieldTouched("firstName")}               
                />
                { touched.firstName && errors.firstName && (<Text style={styles.errorText}>{errors.firstName}</Text>)}

                <View style = {styles.inputLable}>
                  <Icon name="user" type="font-awesome" size={20}/>
                  <Text> Last Name</Text>
                </View>
                <TextInput style = {styles.inputView}
                  value={values.lastName}
                  autoCapitalize = 'words'
                  placeholder = 'Last Name'
                  onChangeText={handleChange('lastName')} 
                  onBlur={()=>setFieldTouched("lastName")}              
                />
                {touched.lastName && errors.lastName && (<Text style={styles.errorText}>{errors.lastName}</Text>)}



                <View style = {styles.inputLable}>
                    <Icon color='#444' name='phone' type = 'font-awesome' size={20}/>
                    <Text> Phone</Text>
                </View>
                <TextInput style = {styles.inputView}
                  value = {values.phone}
                  keyboardType = 'phone-pad'
                  returnKeyType ='next'
                  placeholder = 'Phone'
                  onChangeText={ handleChange('phone') }
                  onBlur={()=>setFieldTouched("phone")} 
                />
                {touched.phone && errors.phone && (<Text style={styles.errorText}>{errors.phone}</Text>)}
                  
                <View style = {styles.inputLable}><Text>Institution</Text></View>
                <SelectList
                  //defaultOption={{key:`${defaultInstArr.indexOf(userData?.institution)}`,value: userData?.institution}}
                  defaultOption={{key: userData?.institution,value: userData?.institution}}
                  data={allInstitutions}
                  save="value"
                  setSelected={handleChange('institution')} 
                />
                { errors.institution && (<Text style={styles.errorText}>{errors.institution}</Text>)}
                
              </View>
              <TouchableOpacity 
                style ={ [styles.loginButton, {backgroundColor:isValid || isSubmitting? 'green': '#a5c9ac'}]}
                disabled={!isValid || isSubmitting}
                onPress={handleSubmit}
              >
                <Text style ={ styles.buttonText }>Update Info</Text>
              </TouchableOpacity>
              
              <Button
                title="Account or Data Deletion"
                onPress={() =>{
                  Alert.alert(
                    'Delete Account Confirmation',
                    `Are you sure your account, if delete your account it will be deleted immediately and you will not be able to access your account or use this app. But Please Note, any other data associated to your account will be deleted within 7 days. Press "Delete" to delete your account.`,
                    [
                    {
                        text: 'Cancel',
                        onPress: () => null,
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        onPress: async() => {
                          const { error } = await supabase.auth.admin.deleteUser(
                            userData.user_id, true
                          )
                          if(!error) await supabase.auth.signOut()
                        },
                    },
                    ],
                );
                   
                  //Linking.openURL('https://weconnect02.epizy.com/?i=1')
                }}
                style={styles.button}
              />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    )}
    </Formik>
    )
}

export default Personalnfo;

const styles = StyleSheet.create({

  container:{
    flexGrow:1,
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#eee',
  },
  centeredContainer:{
    marginVertical:10,
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 10,
    paddingHorizontal:14,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset:{
        width:2,
        height: 2,
    },
    elevation: 5,
    shadowOpacity:1

  },
  errorText:{
      color: 'red',
      fontSize: 11,
  },
  inputLable:{
      flexDirection: 'row',
      marginBottom: 3,
      marginTop: 15,
  },
  inputView:{
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between',
    width: '100%',
    height: 40,
    backgroundColor: '#f1f3f6',
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  loginButton:{
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop:30,
    marginBottom:10
  },
  buttonText:{
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  
})