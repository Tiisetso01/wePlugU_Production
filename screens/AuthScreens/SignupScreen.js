import React, {useEffect, useState}from "react";
import {Text, View, StyleSheet, TouchableOpacity, 
    SafeAreaView, TouchableWithoutFeedback,ScrollView, TextInput, 
     Keyboard, Alert, Platform, KeyboardAvoidingView} from "react-native";
import {Icon, Input} from 'react-native-elements';
import { Picker } from "@react-native-picker/picker";
import { SelectList } from 'react-native-dropdown-select-list';
import { supabase } from "../../supabase/supabase";
import { Formik } from 'formik';
import * as Yup from "yup";
import { fetchInstitutions } from "../../utils/globalFunctions";


const SignupScreen = ({navigation}) =>{
    const [passwordSecured, setPasswordSecured] = useState(false);
    const [allInstitutions, setAllInstitutions] = useState([]);
    const [referredBy_code, setReferredBy_code] = useState("")
   
    const handleSignUp = async (values) => {
             
        const res = await supabase.auth.signUp({ email: values.email, password: values.password });
         if(res.error) return Alert.alert('Error Message', res.error.message)
         
        let user_id = res.data.user.id
        
        let referral_code = user_id.split("-")[0]
        
        const {data, error} = await supabase
        .from('Users')
        .insert({ user_id, referral_code, ...values})
        
        if(!error){

            const {data, error} = await supabase
            .from('Referrals')
            .insert({ referredBy_code})
            if(error) 
            return
        }
        
        Alert.alert('Error Message', "Something went wrong when when saving you data");
        return;
        
    };
    
    const getInstitutions= ()=>{
        setAllInstitutions( fetchInstitutions())
    }

    useEffect(()=>{ getInstitutions() },[])

    const validationSchema = Yup.object({

        firstName: Yup.string().trim().min(3, "should be atleast 3 minimum of characters.")
        .required("First Name is required."),
        lastName: Yup.string().trim().min(3, "Should be atleast 3 minimum of characters.")
        .required("Last Name is required."),
        email: Yup.string().trim().email("Please enter valid email").required("Please enter your email address."),
        phone: Yup.string().trim().matches(/^[0-9]+$/,"Must be digits only").required("Phone number is required."),
        institution: Yup.string().required("Please select instutition."),
        password: Yup.string().trim().min(6,"Password should atleast be 6 characters long.").required("Password is required."),
      });
    
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        institution: "",
        password: "",
    };

    return(
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
            
            await handleSignUp(values)
            //resetForm();
      }}
    >
        {({ values, errors, touched, handleChange, handleBlur,setFieldTouched,isValid, handleSubmit, isSubmitting, }) => (
            <SafeAreaView style ={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style ={styles.container}>
                    <ScrollView  contentContainerStyle ={styles.innerContainer}>

                        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                        
                            <View style ={styles.centeredContainer}>
                                <Text style = {styles.singupTitle}>Signup</Text>
                                <View style = {styles.hr}></View>

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
                                        <Icon color='#444' name='envelope' type = 'font-awesome' size={20}/>
                                        <Text> Email</Text>
                                    </View>
                                    <TextInput style = {styles.inputView}
                                        value = {values.email}
                                        autoCapitalize = 'none'
                                        keyboardType = 'email-address'
                                        textContentType ='emailAddress'
                                        placeholder = 'Email'
                                        onChangeText={handleChange('email')}
                                        onBlur={()=>setFieldTouched("email")} 
                                    />
                                    {touched.email && errors.email && (<Text style={styles.errorText}>{errors.email}</Text>)}

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

                                   

                                    <View style = {styles.inputLable}><Text>Institutions</Text></View>
                                    <SelectList 
                                        data={allInstitutions}
                                        save="value"
                                        setSelected={handleChange('institution')} 
                                        
                                    />
                                    { errors.institution && (<Text style={styles.errorText}>{errors.institution}</Text>)}

                                    <View style = {styles.inputLable}>
                                        <Icon color='#333' name='lock' type = 'font-awesome' size={20}/>
                                        <Text> Password</Text>
                                    </View>
                                    <View style ={styles.inputView}>
                                        <TextInput style={{flex:1}}
                                            value = {values.password}
                                            autoCapitalize = 'none'
                                            secureTextEntry = {!passwordSecured}
                                            textContentType ='password'
                                            placeholder = 'Password'
                                            onChangeText={handleChange("password")}
                                            onBlur={()=>setFieldTouched('password')}
                                        />
                                        <TouchableOpacity style= {{height:40, justifyContent: 'center'}} onPress={()=>{setPasswordSecured(!passwordSecured)}}>
                                            <Icon name={!passwordSecured ? "eye": "eye-slash" }  type="font-awesome-5" size={20}/>
                                        </TouchableOpacity>
                                    </View>
                                    {touched.password && errors.password && (<Text style={[styles.errorText]}>{errors.password}</Text>)}
                                    
                                </View>

                                <View style = {styles.inputLable}>
                                    <Text> Referral code (optional)</Text>
                                </View>
                                <TextInput style = {styles.inputView}
                                    value = {referredBy_code}
                                    autoCapitalize = 'characters'
                                    placeholder = 'referral code'
                                    onChangeText={text => setReferredBy_code(text)}
                                />
                            
                                <TouchableOpacity 
                                    style ={ [styles.loginButton, {backgroundColor:isValid? 'green': '#a5c9ac'}]}
                                    disabled={!isValid}
                                    onPress={handleSubmit}
                                >
                                    <Text style ={ styles.buttonText }>Signup</Text>
                                </TouchableOpacity>
                                <View style = {styles.loginView}>
                                    <Text style = {styles.loginText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                                        <Text style = {[styles.loginText, {color:'#ff00ff'}]}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )}
    </Formik>
    )
}

export default SignupScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#eee',
    },
    innerContainer:{
        flexGrow:1,
        alignItems: 'center',
    },
    centeredContainer:{
        marginBottom:20,
        backgroundColor: 'white',
        width: '85%',
        marginTop:'10%',
        borderRadius: 10,
        paddingHorizontal:14,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset:{
            width:2,
            height: 2,
        },
        elevation: 3,
        shadowOpacity:1

    },
    singupTitle:{
        marginTop: 10,
        fontWeight: '700',
        fontSize: 22,
        alignSelf: 'center',
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

    hr:{
        width: '100%',
        height: 0.5,
        backgroundColor: '#000',
        marginTop: 6,
        marginBottom: 30,
    },
    loginView:{
        flexDirection: 'row',
    },
    loginButton:{
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop:30,
        marginBottom:15
    },
    buttonText:{
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
   
    loginText:{
        fontSize: 18,
        fontWeight: '700',
        
    }

})