import React, {useEffect, useState}from "react";
import {Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput, Keyboard, Alert, StatusBar, Platform, KeyboardAvoidingView} from "react-native";
import {Icon} from 'react-native-elements';
import { supabase } from "../../supabase/supabase";
import { Formik } from 'formik';
import * as Yup from "yup";


const LoginScreen = ({navigation}) =>{
    const [passwordSecured, setPasswordSecured] = useState(false);
    

    const handleLogin = async (values)=>{
        const {error} = await supabase.auth.signInWithPassword(values)
        if(error){
            Alert.alert('Error Message', error.message)
        }

    }
    
    const validationSchema = Yup.object({
        email: Yup.string().trim().email("Please enter valid email").required("Please enter your email address."),
        password: Yup.string().trim().required("Password is required."),
      });
    
    const initialValues = {
        email: "",
        password: "",
    };
    return(
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
                await handleLogin(values)
            }}
        >
        {({ values, errors, touched, handleChange, setFieldTouched,isValid, handleSubmit, isSubmitting, }) => (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style ={styles.container}>
            <TouchableWithoutFeedback onPress = {()=>Keyboard.dismiss()}>
                <View style ={styles.innerContainer}>
                    <View style ={styles.centeredContainer}>
                        <Text style = {styles.loginTitle}>Login</Text>
                        <View style = {styles.hr}></View>

                        <View style={styles.inputBox}>

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
                                    <Icon name={!passwordSecured ? "eye": "eye-slash" } type="font-awesome-5" size={20}/>
                                </TouchableOpacity>
                            </View>
                            {touched.password && errors.password && (<Text style={styles.errorText}>{errors.password}</Text>)}
                            
                        </View>

                        
                        <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')}>
                            <Text style = {styles.fpText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style ={ [styles.loginButton, {backgroundColor:isValid? 'green': '#a5c9ac'}]}
                            onPress={handleSubmit}
                        >
                            <Text style ={ styles.buttonText }>Login</Text>
                        </TouchableOpacity>

                        <View style = {styles.signupView}>
                            <Text style = {styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={()=>navigation.navigate('Signup')}>
                                <Text style = {[styles.signupText, {color:'#ff00ff'}]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        )}
    </Formik>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    innerContainer:{
        flex:1,
        //marginTop: StatusBar.currentHeight,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    centeredContainer:{
        backgroundColor: 'white',
        width: '80%',
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
    loginTitle:{
        marginTop: 10,
        fontWeight: '700',
        fontSize: 22,
        alignSelf: 'center',
    },
    inputLable:{
        flexDirection: 'row',
        marginBottom: 3,
        marginTop: 10,
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
    errorText:{
        color: 'red',
        fontSize: 11,
    },
    hr:{
        width: '100%',
        height: 0.5,
        backgroundColor: 'black',
        marginTop: 6,
        marginBottom: 30,
    },
    signupView:{
        flexDirection: 'row',
    },
    loginButton:{
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 10,
        marginBottom:20,
    },
    buttonText:{
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    fpText:{
        alignSelf: 'flex-end',
        color: '#B53471',
        fontSize: 16,
        fontWeight: '600',
        marginTop:6,
        
    },
    signupText:{
        fontSize: 18,
        fontWeight: '700',
        
    }

})