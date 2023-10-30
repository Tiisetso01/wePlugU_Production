import React, {useEffect, useState}from "react";
import {Text, View, 
   StyleSheet, TouchableOpacity, TouchableWithoutFeedback,ScrollView, TextInput,  Keyboard} from "react-native";
import {Divider, Icon, } from 'react-native-elements';
import { supabase } from "../supabase/supabase";
import {  showToast } from "../utils/globalFunctions";
import FeedbackMessageModal from "../components/FeedbackMessageModal";
import { emailImage, errorImage,} from "../utils/Constants";
import { fecthInfo } from "../utils/supabaseGlobalFunctions";


const EmailPassword = () =>{
    const [passwordSecured, setPasswordSecured] = useState(false);
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null)
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errors, setErrors] = useState({email: "", password:""});
    const [message, setMessage] = useState("")
    const [supabaseError, setSupabaseError] = useState(false)

    useEffect(()=>{
      const fetchUser = async()=>{
        setUser( await fecthInfo())
        setEmail((await fecthInfo()).email)
      }
      fetchUser()
    },[])
    
   const changeEmail = async(email) =>{
    
      var validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if(email == "") return setErrors({email:"Please enter email address.", password:""})
      if(email == (await fecthInfo()).email ) return showToast("No changes made", "orange")
      if(!email.match(validEmailRegex)) return setErrors({email:"Please enter valid email.", password:""})
     
      const { data, error } = await supabase.auth.updateUser({email})
      setErrors({email: "", password:""})
      if(!error){
        const {error} = await supabase.from("Users")
        .update({email})
        .eq("user_id", user.id)

        //TODO: authenticate the email, 
        if(!error) {
          setMessage("Check spams or emails inbox of your new email to verify your email.")
          setIsModalVisible(true)
          return 
        }
        return showToast("Failed, Internal error occurred.", "red")
      }
 
      setMessage(error.message)
      setSupabaseError(true)
      setIsModalVisible(true)
      return
   }
 
   const changePassword = async(password) =>{
      
    if(password == "") return setErrors({password:"Password required.", email:""})
    if(password.length < 6) return setErrors({password:"Password should atleast be 6 characters.",email:"" })
    if(password != confirmPassword ) return setErrors({password:"Password do not match.",email:"" })
    
    const { data, error } = await supabase.auth.updateUser({password})

    setErrors({email: "", password:""})
    setConfirmPassword("")
    setPassword("")

    if(!error){
      const {data, error:err} = await supabase.from("Users")
      .update({password})
      .eq("user_id", user.id)
      
     
      if(!err || !error){
        showToast("Password updated successfully!", "green")
        return 
      }
      //showToast("Failed, Internal error occurred.", "red")
      return 
    }

    return showToast("Internal error occurred.", "red")
    
    
 }
    return(

      <ScrollView  contentContainerStyle ={styles.container}>

        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        
          <View style ={styles.centeredContainer}>
            
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
          
            {errors.email && (<Text style={styles.errorText}>{errors.email}</Text>)}
            {isDisabled = user?.email == email ? true : false}
            <TouchableOpacity 
                disabled={isDisabled}
                style ={ [styles.loginButton, {backgroundColor: isDisabled ? '#a5c9ac' :'green'}]}
                onPress={()=> changeEmail(email)}
              >
                <Text style ={ styles.buttonText }>Change Email</Text>
            </TouchableOpacity> 


            <Divider 
              color='#000' 
              style={{marginVertical:20, }}
            />
        
            <View style = {styles.inputLable}>
                <Icon color='#333' name='lock' type = 'font-awesome' size={20}/>
                <Text> New Password</Text>
            </View>
            <View style ={styles.inputView}>
              <TextInput style={{flex:1}}
                value = {password}
                autoCapitalize = 'none'
                secureTextEntry = {!passwordSecured}
                textContentType ='password'
                placeholder = 'Password'
                onChangeText={text => setPassword(text.trim())}
              />
              <TouchableOpacity style= {{height:40, justifyContent: 'center'}} onPress={()=>{setPasswordSecured(!passwordSecured)}}>
                  <Icon name={!passwordSecured ? "eye": "eye-slash" }  type="font-awesome-5" size={20}/>
              </TouchableOpacity>
            </View>

            <View style = {styles.inputLable}>
                <Icon color='#333' name='lock' type = 'font-awesome' size={20}/>
                <Text> Confirm Password</Text>
            </View>
            <View style ={styles.inputView}>
              <TextInput style={{flex:1}}
                  value = {confirmPassword}
                  autoCapitalize = 'none'
                  secureTextEntry = {!passwordSecured}
                  textContentType ='password'
                  placeholder = 'Password'
                  onChangeText={text => setConfirmPassword(text.trim())}
              />
              <TouchableOpacity style= {{height:40, justifyContent: 'center'}} onPress={()=>{setPasswordSecured(!passwordSecured)}}>
                  <Icon name={!passwordSecured ? "eye": "eye-slash" }  type="font-awesome-5" size={20}/>
              </TouchableOpacity>
            </View>
                { errors.password && (<Text style={[styles.errorText]}>{errors.password}</Text>)}
                
              {isInValid = password =="" || confirmPassword == "" }
              <TouchableOpacity 
                disabled={isInValid}
                style ={ [styles.loginButton, {backgroundColor:isInValid ?'#a5c9ac':'green'}]}
                onPress={()=> changePassword(password)}
              >
                <Text style ={ styles.buttonText }>Change Password</Text>
              </TouchableOpacity>


              {/**Model */}
              <FeedbackMessageModal
                requireImagePath={supabaseError? errorImage : emailImage}
                isModalVisible={isModalVisible}
                onPress={()=>{
                  setMessage("")
                  setSupabaseError(false)
                  setIsModalVisible(false)
                }}
                message={message}
                ButtonTitle="Okay"
                color="green"
              />
          </View>
          
        </TouchableWithoutFeedback>
      </ScrollView>
    )
}

export default EmailPassword;

const styles = StyleSheet.create({

  container:{
    flexGrow:1,
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  centeredContainer:{
    marginVertical:10,
    backgroundColor: '#fff',
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