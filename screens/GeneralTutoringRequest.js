import { StyleSheet, Text, View,TextInput, ScrollView, Button,Alert, TouchableWithoutFeedback,
   Keyboard, KeyboardAvoidingView, Platform  } from 'react-native'
import React, { useState } from 'react';
import { supabase } from '../supabase/supabase';
import { successImage } from '../utils/Constants';
import FeedbackMessageModal from '../components/FeedbackMessageModal';
import { SelectList } from 'react-native-dropdown-select-list';
import TutoringTopTabs from '../components/TutoringTopTabs';
import { showToast } from '../utils/globalFunctions';
import LargeButton from '../components/LargeButton';


const GeneralTutoringRequest = ({route}) => {
    const {courseCodes} = route.params;
    const [message, setMessage] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelMessage = "Thank you for your request, We will be in touch with you within an hour, to provide you with payment details"
    const modelMessage30 =  modelMessage + ", and how you will make tutor request."
    const [selectedTab, setSelectedTab] = useState(0)

    const handleSubmit = async(price)=>{
      
        const {data, error} = await supabase.from("TutoringRequests")
        .insert({price_plan:price, message, courseCode})

      

      if(!error){
        setMessage("");
        return setIsModalVisible(true)
      } 
      
      Alert.alert("Error Message", "Internal Error occurred while submitting your request, please try again")

    }

    if(selectedTab == 1){

      return (
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom:20, flexGrow:1, paddingHorizontal:10}}
          >
          <Text style={styles.headerText}>A+ Premium Tutors</Text>
          <TutoringTopTabs  selected={selectedTab} onPress={()=>setSelectedTab(selectedTab == 1 ? 0 : 1)}/>
            {
                //TODO: Two top tabs one for 1 day tutor other for 30 day tutor
            }

            <View style={styles.noticeText}>
              <Text style={{fontSize:16}}>
               Are you struggling with to understand specific topics, Assignments, Past Papers, other courses related content?
               </Text>
             
              <Text style={{fontSize:16}}>Okay, 
              <Text style={{color:"#be9e44", fontWeight:"bold"}}> A+ Premium tutors </Text>
                got you, They will break complex concepts, or problems into simple words and solve complex problems in a way that you will understand.
              </Text>
             
             <Text style={{fontSize:16}}>
              Take advantage of this opportunity, do not struggle in a course while there are tutors that master the course you are struggling with,
              who can help you master the course and get good grade.
              {"\n"}Subscribe to get a tutor today and get the best out of it.
            </Text>
            
          </View>
          
          <View style={styles.noticeText}>
            <Text style={{fontWeight:"bold", fontSize:18}}>Get 10 Tutoring sessions for any courses at anytime within 30 days. Only for:</Text>
            <View style={{flexDirection:"row", justifyContent:"center"}}>
              <Text style={{fontWeight:"bold", fontSize:18, color:"green"}}>R500  </Text>
              <Text style={{fontWeight:"600", fontSize:18, color:"#000", textDecorationLine:"line-through"}}>R700 </Text>
              <Text style={{fontWeight:"bold", fontSize:18}}> {"---->"} </Text>
              <Text style={styles.subscriptionPrice}>  SAVE 29%</Text>
            </View>
          </View>
         
          <LargeButton
            color="blue"
            title='Request' 
            onPress={()=>{
              Alert.alert(
                "Requesting Tutor Confirmation",
                "You are about to subscribe for 10 Tutoring session, press confirm to submit your request.",
                [
                  {
                      text: 'Cancel',
                      onPress: () => null,
                  },
                  {
                      text: 'Confirm',
                      onPress: async() => { await handleSubmit(500)},
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
            message={modelMessage30}
            ButtonTitle="Okay"
            color="green"
          />
    
        </ScrollView>
      )
    }
    
  
  return (

    <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : "height"}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.innerContainer}>
            <Text style={styles.headerText}>A+ Premium Tutors</Text>
            <TutoringTopTabs selected={selectedTab} onPress={()=>setSelectedTab(selectedTab == 1 ? 0 : 1)}/>


            <View style={styles.subscriptionCard}>
                <Text style={styles.subscriptionTitle}>* 1 hour Tutoring Session from our Premium Tutors for any course.</Text> 
                <Text style={styles.subscriptionTitle}>* Premium Academic Guidance from best Tutors at the lowest price.</Text>
                <Text style={styles.subscriptionPrice}>Pay only R70</Text>
            </View>


            <View>
              <SelectList
                  data={courseCodes}
                  save="value"
                  setSelected={val => setCourseCode(val)}   
              />
            </View>

            
            <Text style={styles.messageLabel}>What you need help with? (optional)</Text>
            <Text style={styles.noticeText}>
              This is optional, but telling us in advance about the specific topic or 
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

                if(courseCode == "") return showToast("Please select atleast one course", "orange")
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
                        onPress: async() => { await handleSubmit(70)},
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

export default GeneralTutoringRequest

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:10,
    
  },
  innerContainer:{
    flexGrow:1,
    paddingBottom:100,
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
     marginVertical:5,
     alignSelf:"flex-start",
     fontWeight:'bold'

  },
  subscriptionCard: {
    backgroundColor: "#E5962D",
    borderRadius: 10,
    padding:5,
    marginBottom: 10,
    //alignItems: 'center',
    elevation: 3,
  },
  subscriptionTitle:{
    fontSize:16,
    color:"#fff",
    fontWeight:"bold"
  },
  subscriptionPrice:{
    fontWeight:"bold", 
    fontSize:18,
    color:"#e90c59",
    alignSelf:"center"
  },
  noticeText:{
    padding: 5,
    fontSize:16,
    borderColor:"#ccc",
    borderRadius: 8,
    borderWidth:1,
    marginBottom:15
  },
  input: {
    borderWidth: 1,
    fontSize:15,
    minHeight:100,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    width:'100%',
    marginTop:15,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
})