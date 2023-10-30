import { StyleSheet, Text, View,TextInput, ScrollView, Button,Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react';
import { supabase } from '../supabase/supabase';
import { successImage } from '../utils/Constants';
import FeedbackMessageModal from '../components/FeedbackMessageModal';
import LargeButton from '../components/LargeButton';


const TutoringRequest = ({route}) => {
    const {fileInfo} = route.params;
    const filesNames = [fileInfo.questionsFileName, ...fileInfo.solutionsFileName]
    const [message, setMessage] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelMessage = "Thank you for your request, We will be in touch with you within an hour."

    const handleSubmit = async()=>{
      
      const {data, error} = await supabase.from("TutoringRequests")
      .insert({file_id: fileInfo.file_id, message, courseCode: fileInfo.course_code});

      if(!error) return setIsModalVisible(true)
      Alert.alert("Error Message", "Internal Error occurred while submitting your request, please try again")

    }
  return (
    <KeyboardAvoidingView
       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <ScrollView  
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.innerContainer}
      >
          <Text style={styles.headerText}>A+ Premium Tutors</Text>

          <View>
            <Text style={[styles.messageLabel,{}]}>These are Papers you need help with:</Text>
            {
              filesNames.map((file, index)=>(
                <Text 
                  style={styles.fileName}
                  key={index} 
                >
                {
                  file.length > 35
                    ? file.slice(0, 35) + ".pdf"
                    : file
                }
                </Text>
              ))
            }
          </View>

          
          <Text style={styles.messageLabel}>What you need help with? (optional)</Text>
          <Text style={styles.noticeText}>
            This is optional, but telling us in advance about the specific topic,
            concept you need help with is helpful, because it will help our tutor prepare relevant materials, examples, and 
            explanations tailored to your needs. This ensures that the tutoring session is focused, efficient, 
            and productive.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Optional"
            multiline
            numberOfLines={5}
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <LargeButton
            color="blue"
            title='Request' 
            onPress={()=>{
              
              Alert.alert(
                "Requesting Tutor Confirmation",
                "You are about to request a tutor, press confirm to submit your request.",
                [
                  {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'cancel',
                  },
                  {
                      text: 'Confirm',
                      onPress: async() => { await handleSubmit()},
                  },
                ],
              
              )
            }}

          />
          {/**Model */}
          <FeedbackMessageModal
            requireImagePath={successImage}
            isModalVisible={isModalVisible}
            onPress={()=>{
              setMessage("")
              setIsModalVisible(false)
            }}
            message={modelMessage}
            ButtonTitle="Okay"
            color="green"
          />

        </ScrollView>
    </TouchableWithoutFeedback>
      
  </KeyboardAvoidingView>
  )
}

export default TutoringRequest

const styles = StyleSheet.create({
  container:{
    flex:1,
    
  },
  innerContainer:{
    flexGrow:1,
    padding:10,
    paddingBottom:120
  },
  
  headerText:{
    fontSize:22,
    fontWeight:'bold',
    color:"#be9e44",
    marginTop: 10,
    marginBottom:30,
    alignSelf:"center"
  },
  messageLabel:{
    fontSize:16,
     marginVertical:5,
     alignSelf:"flex-start",
     fontWeight:'bold'

  },
  fileName:{
    fontSize:16,
    fontWeight:"700",
    color:"blue"
  },
  noticeText:{
    padding: 5,
    fontSize:16,
    borderColor:"#ccc",
    borderRadius: 8,
    borderWidth:1,
  },
  input: {
    borderWidth: 1,
    fontSize:16,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    width:'100%',
    minHeight:100,
    marginTop:15,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
})