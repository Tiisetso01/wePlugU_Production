import React, {useEffect, useState}from "react";
import {Text, View, 
   StyleSheet, TouchableOpacity, TouchableWithoutFeedback,ScrollView, TextInput,  Keyboard, Image, KeyboardAvoidingView, Platform, } from "react-native";
import { Icon, } from 'react-native-elements';
import { supabase } from "../../supabase/supabase";
import * as Linking from "expo-linking";
import FeedbackMessageModal from "../../components/FeedbackMessageModal";
import { errorImage, keyImage, successImage } from "../../utils/Constants";



const ForgotPassword = () =>{

    const [email, setEmail] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errors, setErrors] = useState("");
    const [supabaseErrors, setSupabaseErrors] = useState(false);
    const [message, setMessage] = useState("")
  
    
   const changeEmail = async(email) =>{
      
      var validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if(email == "") return setErrors("Please enter email address.")
      if(!email.match(validEmailRegex)) return setErrors("Please enter valid email.")

      const resetPasswordURL = Linking.createURL("UpdatePassword");
  
      const {error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetPasswordURL,
      });
      if(error)return setMessage(error.message)
      
      setMessage("Check your spams or emails inbox to verify your email.")
      setIsModalVisible(true)
      
   }
 

    return(

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style ={styles.container}>

        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
          <View style={styles.innerContainer}>
            <View style ={styles.centeredContainer}>


              <Text style={styles.headerText}>Reset Password Request</Text>
              <Image source={keyImage} style={styles.headerImage}/>

              {/** INPUTBOX */}
              <View style={{width:"100%"}}>
                <View style = {styles.inputLable}>
                  <Icon color='#444' name='envelope' type = 'font-awesome' size={20}/>
                  <Text> Email</Text>
                </View>
                <TextInput style = {styles.inputView}
                  value = {email}
                  autoCapitalize = 'none'
                  keyboardType = 'email-address'
                  textContentType ='emailAddress'
                  placeholder = 'Email'
                  onChangeText={text => setEmail(text)}
                />
              </View>
            
              {errors && (<Text style={styles.errorText}>{errors}</Text>)}
              <TouchableOpacity 
                  style ={ [styles.loginButton, {backgroundColor: '#3c4'}]}
                  onPress={()=> changeEmail(email)}
                >
                  <Text style ={ styles.buttonText }>Submit</Text>
              </TouchableOpacity>

              {/** MODAL */}
              <FeedbackMessageModal
                  requireImagePath={supabaseErrors ? errorImage : successImage}
                  isModalVisible={isModalVisible}
                  onPress={()=>{
                    setIsModalVisible(false)
                    setEmail("")
                    //navigation.replace(error ? "AuthStackScreens" : "MainHomeScreen" )
                  }}
                  message={message}
                  ButtonTitle="Okay"
                  color="green"
              />
                
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
}

export default ForgotPassword;

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor: '#eee',
  },
  innerContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent:'center',
  },
  centeredContainer:{
    paddingTop: 30,
    marginVertical:10,
    alignItems: 'center',
    justifyContent:'center',
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
    elevation: 3,
    shadowOpacity:1

  },
  headerText:{
    fontWeight:'bold',
    fontSize:22,
    marginTop:10,
  },
  headerImage:{
    height:100,
    width:100,
    marginBottom:12
  },
  errorText:{
      color: 'red',
      fontSize: 14,
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