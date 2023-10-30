import { StyleSheet, View, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import SmallButton from '../components/SmallButton';
import DualBallLoading from '../components/DualBallLoading';
import NoDataMessage from '../components/NoDataMessage';
import { supabase } from '../supabase/supabase';
import { showToast } from '../utils/globalFunctions';
import { realTimeData } from '../utils/supabaseGlobalFunctions';
import TutoringRequestInfoFields from '../components/TutoringRequestInfoFields';



const AttendedTutoringRequests = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [requestsData, setRequestsData] = useState([]);
  

  const fecthData = async()=>{
    const {data, error} = await supabase.from("TutoringRequests")
    .select("*, Users(firstName, lastName,institution, email, phone), Documents(questionsFileName)")
    .match({isDeleted: false, attended: true})
    .order("created_at", {ascending: false})
    
    if(!error){ 
        setRequestsData(data)
        return setIsLoading(false)
    }
    setIsLoading(false)
    showToast("Internal Error occurred.")
  }

  const handleDelete = async(id)=>{
    const {error} = await supabase.from("TutoringRequests")
    .update({isDeleted: true})
    .eq("id", id)
  
    if(!error) return showToast("Deleted Successfully.", "green")
    showToast("Failed, Internal Error occurred","red")
  }
  useEffect(()=>{realTimeData(fecthData, "TutoringRequests")},[])
  useEffect(()=>{fecthData() },[])


  if(isLoading) return <DualBallLoading />
  if(requestsData.length == 0) return <NoDataMessage message="Attended Tutoring Requests will appear here."/>

  return (

    <FlatList 
      contentContainerStyle={{backgroundColor:"#DCDCDC", flexGrow:1}}
      showsVerticalScrollIndicator={false}
      data={requestsData}
      keyExtractor={(item)=> item.id}
      renderItem={({item})=>(
        <View style={styles.cartContainer}>

          <TutoringRequestInfoFields
              fileObj={item.Documents}
              fullName={`${item.Users.firstName} ${item.Users.lastName}`}
              institution={item.Users.institution}
              email={item.Users.email}
              phone={item.Users.phone}
              courseCode={item.courseCode}
              price={item.price_plan}
              message={item.message}
              created_at={item.created_at}
          />
            <View style={styles.submitBtnContainer}>
              <SmallButton 
                  title="Delete"
                  color="red"
                  onPress={()=>{
                    Alert.alert(
                      'Delete',
                      `Are you sure you want to delete this request?`,
                      [
                      {
                          text: 'Cancel',
                          onPress: () => null,
                      },
                      {
                          text: 'Yes',
                          onPress: async() => { await handleDelete(item.id)},
                      },
                      ],
                    );
                  }}
              />
            </View>

        </View> 
      )}
    />
  )
}

export default AttendedTutoringRequests

const styles = StyleSheet.create({
  cartContainer:{
    margin:8,
    padding: 5,
    backgroundColor:'#fff',
    borderRadius:10
  },
  submitBtnContainer:{
    alignSelf:'center',
    marginVertical:10,
  }
})