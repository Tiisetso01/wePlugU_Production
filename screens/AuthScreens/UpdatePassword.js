import React, {useEffect, useState}from "react";
import {Text, View, 
   StyleSheet, TouchableOpacity, TouchableWithoutFeedback,ScrollView, TextInput,  Keyboard, Alert, Image, Platform, KeyboardAvoidingView} from "react-native";
import {Icon, } from 'react-native-elements';
import { supabase } from "../../supabase/supabase";
import { useNavigation } from "@react-navigation/native";
import FeedbackMessageModal from "../../components/FeedbackMessageModal";
import { errorImage, keyImage, successImage } from "../../utils/Constants";



const UpdatePassword = ({route}) =>{


     const {access_token, refresh_token} = route.params
    const [passwordSecured, setPasswordSecured] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [error, setError] = useState(false)
    const [message, setMessage] = useState("Password Updated Successfully.")
    const navigation = useNavigation()

   const changePassword = async(password) =>{
      
    if(password == "") return setErrors("Password required.")
    if(password.length < 6) return setErrors("Password should atleast be 6 characters.")
    if(password != confirmPassword ) return setErrors("Password do not match.")
    
    const {data:{ user } , error} = await supabase.auth.setSession({access_token, refresh_token,});
    //await supabase.auth.refreshSession();
    if(error){
      setError(true)
      setMessage("Internal error occurred while updating your data.")
      setIsModalVisible(true)
      return 
    } 
         
    const res =  await supabase.auth.updateUser({password})
    if(!res.error){
      const {data, error} = await supabase.from("Users")
      .update({password})
      .eq("user_id", user.id)

      if(!error){
        setIsModalVisible(true)
        return 
      } 
    }
    setError(true)
    setMessage("Failed to update Password.")
    setIsModalVisible(true)
    return 

 }
    return(

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style ={styles.container}>

        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.innerContainer}>
            <View style ={styles.centeredContainer}>

              <View style={{width:"100%", alignItems:'center'}}>
                <Text style={styles.headerText}>Update Password</Text>
                <Image source={keyImage} style={styles.headerImage}/>
              </View>
              
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
                  { errors && (<Text style={[styles.errorText]}>{errors}</Text>)}
                  
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
                requireImagePath={error ? errorImage : successImage}
                isModalVisible={isModalVisible}
                onPress={()=>{
                  setIsModalVisible(false)
                  navigation.replace(error ? "AuthStackScreens" : "MainHomeScreen" )
                }}
                message={message}
                ButtonTitle="continue"
                color="green"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
}

export default UpdatePassword;

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor: '#eee',
  },
  innerContainer:{
    flexGrow:1,
    alignItems: 'center',
    justifyContent:'center',
  },
  centeredContainer:{
    paddingTop: 30,
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